import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getOpenAiCompletion(prompt: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'user', content: prompt }
            ]
        });
        const content = response.choices[0].message.content;
        return content !== null ? content : '';
    } catch (error) {
        console.error('Error fetching OpenAI completion:', error);
        throw error;
    }
}
