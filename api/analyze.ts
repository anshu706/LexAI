import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentText } = req.body as { documentText?: string };
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are analyzing a legal document. Extract and return ONLY valid JSON — no preamble, no markdown fences, no commentary.\n\nDocument text:\n"""\n${documentText}\n"""` }]
        }
      ],
      config: {
        systemInstruction: `You are LexAI, an expert AI legal document analyst with deep knowledge of:\n- Indian contract law, tenancy law (Gujarat Tenancy Act, Maharashtra Rent Control Act)\n- Employment law (Indian Labour Code, Shops & Establishments Act)\n- Consumer protection law and standard NDA/TOS structures\n\nYour SOLE purpose is to protect non-lawyers from unfair, unclear, or illegal clauses. You do NOT give legal advice. You give legal CLARITY.\n\nRules you NEVER break:\n1. Always respond in plain, simple language — zero legalese in outputs\n2. Every claim you make must be grounded in the actual document text provided\n3. If something is not in the document, say "Not specified in this document"\n4. Never hallucinate clauses, dates, or names\n5. Always add: "Consult a qualified lawyer before signing any legal document"\n\nSeverity definitions:\n- CRITICAL: Illegal, highly exploitative, or creates major financial/legal risk\n- WARNING: One-sided, unusual, or worth negotiating before signing\n- FINE: Standard, fair, and acceptable — no action needed`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            document_type: { type: Type.STRING },
            parties: {
              type: Type.OBJECT,
              properties: {
                party_a: { type: Type.STRING },
                party_b: { type: Type.STRING }
              }
            },
            key_terms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  value: { type: Type.STRING },
                  clause_reference: { type: Type.STRING },
                  risk_level: { type: Type.STRING, enum: ['none', 'low', 'medium', 'high'] }
                }
              }
            },
            duration: {
              type: Type.OBJECT,
              properties: {
                start_date: { type: Type.STRING, nullable: true },
                end_date: { type: Type.STRING, nullable: true },
                lock_in_period: { type: Type.STRING, nullable: true },
                notice_period: { type: Type.STRING, nullable: true }
              }
            },
            obligations: {
              type: Type.OBJECT,
              properties: {
                party_a: { type: Type.ARRAY, items: { type: Type.STRING } },
                party_b: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            red_flags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ['CRITICAL', 'WARNING', 'FINE'] },
                  clause_reference: { type: Type.STRING },
                  clause_quote: { type: Type.STRING },
                  plain_explanation: { type: Type.STRING },
                  why_it_matters: { type: Type.STRING },
                  recommended_action: { type: Type.STRING }
                }
              }
            },
            overall_fairness_score: { type: Type.INTEGER },
            summary_in_one_paragraph: { type: Type.STRING }
          },
          required: ['document_type', 'parties', 'overall_fairness_score', 'summary_in_one_paragraph']
        }
      }
    });

    res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
