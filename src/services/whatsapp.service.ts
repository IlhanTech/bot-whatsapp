import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are not set');
}

const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage(to: string, body: string) {
    try {
        const message = await client.messages.create({
            body,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${to}`
        });
        return message;
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        throw error;
    }
}
