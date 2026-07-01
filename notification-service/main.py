from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from database import engine, get_db, Base
from models import Notification, NotificationPreference
from schemas import (
    EmailRequest, SMSRequest, InAppRequest,
    NotificationResponse, InAppNotification, UnreadCountResponse
)
from services import EmailService, SMSService, NotificationService

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MayaBhedak Notification Service", version="1.0.0")

# Initialize services
email_service = EmailService()
sms_service = SMSService()
notification_service = NotificationService()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Send Notifications (Internal APIs)
@app.post("/notifications/send/email", response_model=NotificationResponse)
async def send_email(request: EmailRequest):
    """Send email notification"""
    try:
        success = email_service.send_email(
            to_email=request.recipient_email,
            subject=request.subject,
            template_name=request.template_name,
            template_data=request.template_data
        )
        return NotificationResponse(
            success=success,
            message="Email sent successfully" if success else "Email sending failed"
        )
    except Exception as e:
        return NotificationResponse(success=False, message=str(e))

@app.post("/notifications/send/sms", response_model=NotificationResponse)
async def send_sms(request: SMSRequest):
    """Send SMS notification"""
    try:
        success = sms_service.send_sms(
            to_phone=request.recipient_phone,
            message=request.message
        )
        return NotificationResponse(
            success=success,
            message="SMS sent successfully" if success else "SMS sending failed"
        )
    except Exception as e:
        return NotificationResponse(success=False, message=str(e))

@app.post("/notifications/send/in-app", response_model=NotificationResponse)
async def create_in_app_notification(request: InAppRequest, db: Session = Depends(get_db)):
    """Create in-app notification"""
    notification = Notification(
        user_id=request.user_id,
        title=request.title,
        message=request.message,
        notification_type=request.notification_type,
        action_url=request.action_url,
        metadata=request.metadata or {}
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return NotificationResponse(
        success=True,
        notification_id=notification.id,
        message="In-app notification created"
    )

# User-facing APIs
@app.get("/notifications", response_model=List[InAppNotification])
def get_notifications(user_id: int, unread_only: bool = False, db: Session = Depends(get_db)):
    """Get user's notifications"""
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    return query.order_by(Notification.created_at.desc()).limit(50).all()

@app.get("/notifications/unread-count", response_model=UnreadCountResponse)
def get_unread_count(user_id: int, db: Session = Depends(get_db)):
    """Get unread notification count"""
    count = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()
    
    return UnreadCountResponse(unread_count=count)

@app.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(notification_id: int, user_id: int, db: Session = Depends(get_db)):
    """Mark notification as read"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    from datetime import datetime
    notification.read_at = datetime.utcnow()
    db.commit()
    
    return NotificationResponse(success=True, message="Notification marked as read")

@app.patch("/notifications/read-all", response_model=NotificationResponse)
def mark_all_as_read(user_id: int, db: Session = Depends(get_db)):
    """Mark all notifications as read"""
    from datetime import datetime
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True, "read_at": datetime.utcnow()})
    db.commit()
    
    return NotificationResponse(success=True, message="All notifications marked as read")

# Health check
@app.get("/notifications/health")
def health_check():
    return {"status": "UP", "service": "notification-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8085)
