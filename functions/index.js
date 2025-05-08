const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send appointment reminder emails
exports.sendAppointmentReminder = functions.database
    .ref('/rhp/appointmentReminders/{reminderId}')
    .onCreate(async (snapshot, context) => {
        const reminder = snapshot.val();
        
        // Check if reminder is pending
        if (reminder.status !== 'pending') {
            return null;
        }

        try {
            // Format the appointment date and time
            const appointmentDate = new Date(reminder.appointmentDate);
            const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Create email content
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: reminder.patientEmail,
                subject: 'Appointment Reminder - Rural Health Program',
                html: `
                    <h2>Appointment Reminder</h2>
                    <p>Dear ${reminder.patientName},</p>
                    <p>This is a reminder that you have an appointment scheduled for:</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${reminder.appointmentTime}</p>
                    ${reminder.description ? `<p><strong>Description:</strong> ${reminder.description}</p>` : ''}
                    <p>Please arrive 10-15 minutes before your scheduled appointment time.</p>
                    <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Rural Health Program Team</p>
                `
            };

            // Send the email
            await transporter.sendMail(mailOptions);

            // Update reminder status to 'sent'
            await admin.database()
                .ref(`/rhp/appointmentReminders/${context.params.reminderId}`)
                .update({ status: 'sent', sentAt: admin.database.ServerValue.TIMESTAMP });

            return null;
        } catch (error) {
            console.error('Error sending reminder email:', error);
            
            // Update reminder status to 'failed'
            await admin.database()
                .ref(`/rhp/appointmentReminders/${context.params.reminderId}`)
                .update({ 
                    status: 'failed', 
                    error: error.message,
                    failedAt: admin.database.ServerValue.TIMESTAMP 
                });

            throw error;
        }
    }); 