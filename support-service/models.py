from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    ticket_number = Column(String(20), unique=True, nullable=False)
    subject = Column(String(200), nullable=False)
    category = Column(String(30), nullable=False)
    status = Column(String(20), nullable=False, default="OPEN")
    priority = Column(String(10), nullable=False, default="MEDIUM")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    messages = relationship("TicketMessage", back_populates="ticket")

class TicketMessage(Base):
    __tablename__ = "ticket_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    sender_type = Column(String(10), nullable=False)
    sender_name = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    attachments = Column(JSON, default=[])
    is_internal = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    ticket = relationship("Ticket", back_populates="messages")

class FAQ(Base):
    __tablename__ = "faq"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    helpful_count = Column(Integer, default=0)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
