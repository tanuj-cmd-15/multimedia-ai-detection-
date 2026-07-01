import os
from typing import Dict, Any, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from twilio.rest import Client
from jinja2 import Environment, FileSystemLoader, select_autoescape
import logging

logger = logging.getLogger(__name__)

# Email templates directory
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')

class EmailService:
    """
    Email service using SendGrid
    """
    
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@mayabhedak.com')
        self.from_name = os.getenv('SENDGRID_FROM_NAME', 'MayaBhedak')
        
        if not self.api_key:
            logger.warning("SENDGRID_API_KEY not set. Email functionality will be disabled.")
            self.client = None
        else:
            self.client = SendGridAPIClient(self.api_key)
        
        # Initialize Jinja2 for template rendering
        self.jinja_env = Environment(
            loader=FileSystemLoader(TEMPLATE_DIR),
            autoescape=select_autoescape(['html', 'xml'])
        )
    
    def send_email(
        self,
        recipient_email: str,
        recipient_name: str,
        subject: str,
        template_name: str,
        template_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send an email using a template
        
        Args:
            recipient_email: Recipient's email address
            recipient_name: Recipient's name
            subject: Email subject line
            template_name: Name of the template file (without .html extension)
            template_data: Data to render in the template
        
        Returns:
            Response dict with success status and details
        """
        if not self.client:
            logger.error("SendGrid client not initialized")
            return {"success": False, "error": "Email service not configured"}
        
        try:
            # Render template
            template = self.jinja_env.get_template(f"{template_name}.html")
            html_content = template.render(**template_data)
            
            # Create email
            from_email_obj = Email(self.from_email, self.from_name)
            to_email = To(recipient_email, recipient_name)
            content = Content("text/html", html_content)
            mail = Mail(from_email_obj, to_email, subject, content)
            
            # Send email
            response = self.client.send(mail)
            
            logger.info(f"Email sent successfully to {recipient_email}. Status: {response.status_code}")
            
            return {
                "success": True,
                "status_code": response.status_code,
                "message": "Email sent successfully"
            }
        
        except Exception as e:
            logger.error(f"Error sending email to {recipient_email}: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

class SMSService:
    """
    SMS service using Twilio
    """
    
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not all([self.account_sid, self.auth_token, self.from_number]):
            logger.warning("Twilio credentials not set. SMS functionality will be disabled.")
            self.client = None
        else:
            self.client = Client(self.account_sid, self.auth_token)
    
    def send_sms(
        self,
        recipient_phone: str,
        message: str,
        template_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send an SMS message
        
        Args:
            recipient_phone: Recipient's phone number in E.164 format (+1234567890)
            message: SMS message text (max 160 characters)
            template_name: Optional template name for predefined messages
        
        Returns:
            Response dict with success status and details
        """
        if not self.client:
            logger.error("Twilio client not initialized")
            return {"success": False, "error": "SMS service not configured"}
        
        try:
            # Send SMS
            message_obj = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=recipient_phone
            )
            
            logger.info(f"SMS sent successfully to {recipient_phone}. SID: {message_obj.sid}")
            
            return {
                "success": True,
                "sid": message_obj.sid,
                "status": message_obj.status,
                "message": "SMS sent successfully"
            }
        
        except Exception as e:
            logger.error(f"Error sending SMS to {recipient_phone}: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

class NotificationService:
    """
    Main notification service coordinating email, SMS, and in-app notifications
    """
    
    def __init__(self, db_session):
        self.email_service = EmailService()
        self.sms_service = SMSService()
        self.db = db_session
    
    async def send_welcome_email(self, user_email: str, user_name: str, verification_code: str):
        """Send welcome email with verification code"""
        return self.email_service.send_email(
            recipient_email=user_email,
            recipient_name=user_name,
            subject="Welcome to MayaBhedak - Verify Your Email",
            template_name="welcome",
            template_data={
                "user_name": user_name,
                "verification_code": verification_code,
                "app_url": os.getenv('APP_URL', 'http://localhost:3000')
            }
        )
    
    async def send_otp_sms(self, phone_number: str, otp: str):
        """Send OTP via SMS"""
        message = f"Your MayaBhedak verification code is: {otp}. Valid for 5 minutes."
        return self.sms_service.send_sms(phone_number, message, template_name="otp")
    
    async def send_trial_expiry_notification(
        self,
        user_email: str,
        user_name: str,
        days_remaining: int,
        usage_stats: Dict[str, int]
    ):
        """Send trial expiry notification"""
        subject = f"Your MayaBhedak trial expires in {days_remaining} day{'s' if days_remaining != 1 else ''}"
        
        return self.email_service.send_email(
            recipient_email=user_email,
            recipient_name=user_name,
            subject=subject,
            template_name="trial_expiry",
            template_data={
                "user_name": user_name,
                "days_remaining": days_remaining,
                "audio_used": usage_stats.get("audio_used", 0),
                "image_used": usage_stats.get("image_used", 0),
                "upgrade_url": os.getenv('APP_URL', 'http://localhost:3000') + "/upgrade"
            }
        )
    
    async def send_password_reset_email(
        self,
        user_email: str,
        user_name: str,
        reset_token: str
    ):
        """Send password reset email"""
        reset_url = f"{os.getenv('APP_URL', 'http://localhost:3000')}/reset-password?token={reset_token}"
        
        return self.email_service.send_email(
            recipient_email=user_email,
            recipient_name=user_name,
            subject="Reset Your MayaBhedak Password",
            template_name="password_reset",
            template_data={
                "user_name": user_name,
                "reset_url": reset_url,
                "expiry_hours": 1
            }
        )
    
    async def send_ticket_update_notification(
        self,
        user_email: str,
        user_name: str,
        ticket_number: str,
        ticket_subject: str,
        message: str
    ):
        """Send ticket update notification"""
        return self.email_service.send_email(
            recipient_email=user_email,
            recipient_name=user_name,
            subject=f"Update on your ticket {ticket_number}",
            template_name="ticket_update",
            template_data={
                "user_name": user_name,
                "ticket_number": ticket_number,
                "ticket_subject": ticket_subject,
                "message": message,
                "ticket_url": f"{os.getenv('APP_URL', 'http://localhost:3000')}/support/tickets/{ticket_number}"
            }
        )
