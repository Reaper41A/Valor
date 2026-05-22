import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const systemInstruction = `
You are the AI Healthcare Access Assistant, a highly supportive, empathetic, and expert community health information system designed for underserved, remote, and low-bandwidth African communities.
Your primary objective is to provide safe preliminary health guidance, first aid instructions, preventative education, and triage, keeping in mind local constraints (e.g., potential lack of clean running water, electricity, cold storage, or nearby advanced medical infrastructure).

CRITICAL REQUIREMENTS:
1. Medical Disclaimer: Every response MUST start with a clear, concise medical disclaimer: "⚠️ AI info assistant. NOT a doctor. For severe symptoms, seek a healthcare worker immediately."
2. Safe Symptom Triage: Help identify if symptoms suggest a medical emergency. Urge professional care immediately if there are red flags (e.g., high fever in infants under 3 months, difficulty breathing, persistent vomiting, loss of consciousness, severe bleeding).
3. Practical, Clean Suggestions: Suggest practical remedies using resources commonly available in rural settings. For example:
   - Diarrheal/Dehydration: Homemade oral rehydration salts (ORS) recipe (1 liter clean water, 6 level teaspoons sugar, 0.5 level teaspoon salt).
   - High Fever: Lukewarm compresses (never ice water or cold alcohol), hydration.
   - Safe drinking water: Boiling water or chlorinated disinfection, three-pot settling method.
   - Wound care: Wash with clean running water and soap. Keep clean and dry.
4. Language Formatting: Speak in simple, clear, and highly focused language. Avoid complex medical jargon. Use bullet points or numbered lists generously to ease reading. Keep responses concise (under 250 words) to save user bandwidth.
5. Answer in the requested language: Respond in the language requested by the user. Languages supported include English, Swahili (Kiswahili), French (Français), Amharic (አማርኛ), Yoruba (Yorùbá), Zulu (isiZulu).
6. Non-diagnostic: Do not claim to diagnose any disease with absolute certainty. Frame answers as "This could be related to..." and suggest what questions they can ask the local healthcare worker.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Symptom Screening Chat
  app.post("/api/chat", async (req: any, res: any) => {
    try {
      const { messages, language } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages payload." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          status: "API_KEY_MISSING",
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in the Secrets panel."
        });
      }

      const ai = getGeminiClient();

      // Convert client messages to Gemini content structures
      const contents = messages.map((m) => {
        return {
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction + `\nSelected community language is ${language || 'English'}. Respond primarily in this language. Keep layout extremely readable and bulleted.`,
          temperature: 0.15,
        }
      });

      const reply = response.text || "I was unable to formulate clinical guidance. Please re-state your symptoms.";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini screening error:", err);
      res.status(500).json({ error: err.message || "An error occurred during symptom screening." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Lazy initialization of Gemini client to prevent crash on boot if key is empty
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

startServer().catch(err => {
  console.error("Failed to start full-stack server:", err);
});
