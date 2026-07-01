from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class NotificationType(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    SUCCESS = "SUCCESS"

class DigestFrequency(str, Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    NEVER = "NEVER"

class Priority(str, Enum):
    HIGH = "HIGH"
    NORMAL = "NORMAL"
    LOW = "LOW"

# Email Schemas
class EmailRequest(BaseModel):
    template_name: str = Field(..., description="Name of the email template (e.g., welcome, otp, trial_expiry)")
    recipient_email: EmailStr
    recipient_name: str
    subject: str
    template_data: Dict[str, Any] = Field(default_factory=dict, description="Dynamic data for template rendering")
    priority: Priority = Priority.NORMAL

class SMSRequest(BaseModel):
    recipient_phone: str = Field(..., pattern=r'^\+[1-9]\d{1,14}$', description="E.164 format phone number")
    message: str = Field(..., min_length=1, max_length=160)
    template_name: Optional[str] = None

class InAppRequest(BaseModel):
    user_id: int
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    notification_type: NotificationType
    action_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# Response Schemas
class NotificationResponse(BaseModel):
    success: bool
    notification_id: Optional[int] = None
    message: str
    provider_response: Optional[Dict[str, Any]] = None

class InAppNotification(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: NotificationType
    is_read: bool
    action_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class UnreadCountResponse(BaseModel):
    unread_count: int

class NotificationPreferences(BaseModel):
    user_id: int
    email_enabled: bool = True
    sms_enabled: bool = True
    in_app_enabled: bool = True
    marketing_emails: bool = False
    digest_frequency: DigestFrequency = DigestFrequency.WEEKLY
    
    class Config:
        from_attributes = True

class NotificationPreferencesUpdate(BaseModel):
    email_enabled: Optional[bool] = None
    sms_enabled: Optional[bool] = None
    in_app_enabled: Optional[bool] = None
    marketing_emails: Optional[bool] = None
    digest_frequency: Optional[DigestFrequency] = None
