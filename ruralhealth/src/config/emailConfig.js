// EmailJS Configuration
// To set up EmailJS:
// 1. Sign up at https://www.emailjs.com/
// 2. Add an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Copy your credentials below

export const EMAIL_CONFIG = {
    // Get these from your EmailJS dashboard
    SERVICE_ID: 'service_x1cth0p', // Replace with your EmailJS service ID
    TEMPLATE_ID: 'template_6c4ksrc', // Replace with your EmailJS template ID
    PUBLIC_KEY: '1wZwrSWeLR9CH6EuJ' // Replace with your EmailJS public key
};

// Email Templates
export const EMAIL_TEMPLATES = {
    APPOINTMENT_CANCELLATION: {
        subject: 'Appointment Cancellation - Rural Health Program',
        template: `
            <h2>Appointment Cancellation Notice</h2>
            <p>Dear {{to_name}},</p>
            <p>This email is to confirm that your appointment has been cancelled:</p>
            <p><strong>Original Appointment Date:</strong> {{appointment_date}}</p>
            <p><strong>Original Appointment Time:</strong> {{appointment_time}}</p>
            {{#if description}}<p><strong>Description:</strong> {{description}}</p>{{/if}}
            <p>If you would like to schedule a new appointment, please contact us or visit our facility.</p>
            <br>
            <p>Best regards,</p>
            <p>{{from_name}}</p>
        `
    }
}; 