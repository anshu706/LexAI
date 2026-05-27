import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentText, question } = req.body as { documentText?: string; question?: string };
    if (!documentText || !question) {
      return res.status(400).json({ error: 'Document text and question are required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `RETRIEVED DOCUMENT EXCERPTS (most relevant sections):\n"""\n${documentText}\n"""\n\nUSER'S QUESTION:\n"${question}"` }]
        }
      ],
      config: {
        systemInstruction: `You are LexAI answering a user's question about their specific legal document.\n\nRules for your answer:\n1. Answer ONLY using information from the excerpts above\n2. Always cite the specific clause, section, or page number\n3. If the answer is NOT in the excerpts, respond exactly:\n   "This is not specified in your document. You should ask the other party to clarify this before signing."\n4. Never answer from general legal knowledge alone\n5. Format: Direct answer first → then clause citation → then practical advice\n6. Keep answers under 100 words unless complexity requires more\n7. End every answer with one actionable next step for the user`,
      }
    });

    res.status(200).json({ answer: response.text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
