import express from 'express';
import bodyParser from 'body-parser';
import { getOpenAiCompletion } from './services/openai.service';
import { sendWhatsAppMessage } from './services/whatsapp.service';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/api/generate-text', async (req, res) => {
    try {
        console.log('Received prompt:', req.body.prompt);
        const prompt = req.body.prompt;
        const completion = await getOpenAiCompletion(prompt);
        res.status(200).json({ completion });
    } catch (error) {
        console.error('Error in /api/generate-text:', error);
        res.status(500).json({ error: 'Failed to generate text' });
    }
});

app.post('/api/send-whatsapp-message', async (req, res) => {
    try {
        console.log('Sending message to:', req.body.to);
        const to = req.body.to;
        const body = req.body.body;
        const message = await sendWhatsAppMessage(to, body);
        res.status(200).json({ message });
    } catch (error) {
        console.error('Error in /api/send-whatsapp-message:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});

app.post('/webhook/incoming-message', async (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    try {
        if (body === 'Hi') {
            await sendWhatsAppMessage(from, 'Hello there!');
        } else {
            await sendWhatsAppMessage(from, 'I am a bot and I do not understand your message');
        }
        res.status(200).send();
    }
    catch (error) {
        console.error('Error in /webhook/incoming-message:', error);
        res.status(500).send();
    }
});
