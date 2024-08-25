import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const twilioSmsNumber = process.env.TWILIO_SMS_NUMBER;


if (!accountSid || !authToken || !twilioSmsNumber || !twilioWhatsappNumber) {
    throw new Error('Twilio credentials are not set');
}

const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage(to: string, body: string) {
    try {
        if (!to.startsWith('whatsapp:')) {
            throw new Error('The "to" number must start with "whatsapp:"');
        }

        const message = await client.messages.create({
            body,
            from: 'whatsapp:' + twilioWhatsappNumber,
            to
        });
        return message;
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return sendSMSMessage(to, body);
    }
}

export async function sendSMSMessage(to: string, body: string) {
    try {
        const message = await client.messages.create({
            body,
            from: twilioSmsNumber,
            to
        });
        return message;
    } catch (error) {
        console.error('Failed to send SMS message:', error);
        throw error;
    }
}