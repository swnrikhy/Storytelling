import { OpenRouter } from '@openrouter/sdk';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = window.location.origin;
const SITE_NAME = 'Narrative Nexus';

export const openRouter = new OpenRouter({
  apiKey: API_KEY,
  httpReferer: SITE_URL,
  xTitle: SITE_NAME,
});

export async function testOpenRouter(prompt: string, model: string = 'openai/gpt-3.5-turbo') {
  if (!API_KEY) {
    throw new Error('OpenRouter API Key is missing. Please set VITE_OPENROUTER_API_KEY in your environment.');
  }

  try {
    const completion = await openRouter.chat.send({
      chatGenerationParams: {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
      }
    });

    const content = completion.choices[0].message.content;
    if (typeof content === 'string') return content;
    return JSON.stringify(content, null, 2);
  } catch (error) {
    console.error('OpenRouter Error:', error);
    throw error;
  }
}
