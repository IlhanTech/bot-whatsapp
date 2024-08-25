import express from 'express';
import bodyParser from 'body-parser';
import { getOpenAiCompletion } from './services/openai.service';
import { sendWhatsAppMessage } from './services/whatsapp.service';

const app = express();
const port = process.env.PORT || 3000;
const AirBnbDescription = process.env.AIRBNB_DESCRIPTION;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/webhook/incoming-message', async (req, res) => {
    console.log('Incoming message: ', req.body);
    const from = req.body.From;
    const body = req.body.Body;

    if (!from || !body) {
        console.error('Invalid request body');
        return res.status(400).send('Invalid request body');
    }

    if (!AirBnbDescription) {
        console.error('AirBnbDescription is not defined');
        return res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }

    try {
        const completion = await getOpenAiCompletion(body, AirBnbDescription);
        const message = await sendWhatsAppMessage(from, completion);
        console.log('Message sent: ', message);
        res.status(200).json({ message });
    } catch (error) {
        console.error('Error in /webhook/incoming-message: ', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});
