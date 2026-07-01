from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TicketCreate(BaseModel):
    user_id: int
    subject: str
    description: str
    category: str
    priority: Optional[str] = None

class TicketResponse(BaseModel):
    id: int
    ticket_number: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TicketSummary(BaseModel):
    id: int
    ticket_number: str
    subject: str
    status: str
    priority: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    user_id: int
    message: str

class MessageResponse(BaseModel):
    id: int
    ticket_id: int
    sender_type: str
    sender_name: str
    message: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class FAQResponse(BaseModel):
    id: int
    category: str
    question: str
    answer: str
    helpful_count: int
    
    class Config:
        from_attributes = True
