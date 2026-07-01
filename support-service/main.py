from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os

from database import engine, get_db, Base
from models import Ticket, TicketMessage, FAQ
from schemas import (
    TicketCreate, TicketResponse, TicketSummary, 
    MessageCreate, MessageResponse, FAQResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MayaBhedak Support Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ticket Endpoints
@app.post("/support/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    """Create new support ticket"""
    
    # Generate ticket number
    count = db.query(Ticket).count()
    ticket_number = f"TKT-{datetime.now().year}-{count + 1:06d}"
    
    # Auto-assign priority based on keywords
    subject_lower = ticket.subject.lower()
    if any(word in subject_lower for word in ["urgent", "critical", "broken", "not working"]):
        priority = "HIGH"
    elif any(word in subject_lower for word in ["billing", "payment", "api key"]):
        priority = "MEDIUM"
    else:
        priority = ticket.priority or "LOW"
    
    db_ticket = Ticket(
        user_id=ticket.user_id,
        ticket_number=ticket_number,
        subject=ticket.subject,
        category=ticket.category,
        status="OPEN",
        priority=priority
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Add initial message
    db_message = TicketMessage(
        ticket_id=db_ticket.id,
        sender_type="USER",
        sender_name=f"User {ticket.user_id}",
        message=ticket.description
    )
    db.add(db_message)
    db.commit()
    
    return db_ticket

@app.get("/support/tickets", response_model=List[TicketSummary])
def list_tickets(user_id: int, status: Optional[str] = None, db: Session = Depends(get_db)):
    """List user's tickets"""
    query = db.query(Ticket).filter(Ticket.user_id == user_id)
    
    if status:
        query = query.filter(Ticket.status == status)
    
    return query.order_by(Ticket.created_at.desc()).all()

@app.get("/support/tickets/{ticket_id}", response_model=dict)
def get_ticket_details(ticket_id: int, user_id: int, db: Session = Depends(get_db)):
    """Get ticket with all messages"""
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.user_id == user_id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    messages = db.query(TicketMessage).filter(
        TicketMessage.ticket_id == ticket_id,
        TicketMessage.is_internal == False
    ).order_by(TicketMessage.created_at).all()
    
    return {
        "ticket": ticket,
        "messages": messages
    }

@app.post("/support/tickets/{ticket_id}/reply", response_model=MessageResponse)
def add_reply(ticket_id: int, message: MessageCreate, db: Session = Depends(get_db)):
    """Add reply to ticket"""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if ticket.status == "CLOSED":
        raise HTTPException(status_code=400, detail="Cannot reply to closed ticket")
    
    db_message = TicketMessage(
        ticket_id=ticket_id,
        sender_type="USER",
        sender_name=f"User {message.user_id}",
        message=message.message
    )
    db.add(db_message)
    
    # Update ticket status
    if ticket.status == "WAITING_USER":
        ticket.status = "OPEN"
    
    ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_message)
    
    return db_message

# FAQ Endpoints
@app.get("/support/faq", response_model=List[FAQResponse])
def get_faq(db: Session = Depends(get_db)):
    """Get all FAQ items"""
    return db.query(FAQ).order_by(FAQ.order).all()

@app.get("/support/faq/search", response_model=List[FAQResponse])
def search_faq(query: str, db: Session = Depends(get_db)):
    """Search FAQ"""
    return db.query(FAQ).filter(
        (FAQ.question.ilike(f"%{query}%")) | (FAQ.answer.ilike(f"%{query}%"))
    ).all()

# Health check
@app.get("/support/health")
def health_check():
    return {"status": "UP", "service": "support-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8084)
