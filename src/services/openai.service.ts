import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getOpenAiCompletion(prompt: string, specialPrompt: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: specialPrompt },
                { role: 'user', content: prompt }
            ],
            max_tokens: 150,
        });
        const content = response.choices[0].message.content;
        return content !== null ? content : '';
    } catch (error) {
        console.error('Error fetching OpenAI completion:', error);
        throw error;
    }
}
