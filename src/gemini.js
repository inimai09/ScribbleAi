
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing VITE_GEMINI_API_KEY. Check your .env file and restart npm run dev.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "missing-key" });

export default ai;
