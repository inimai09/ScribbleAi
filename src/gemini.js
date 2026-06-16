import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
console.log(
  "KEY:",
  import.meta.env.VITE_GEMINI_API_KEY?.slice(0, 10)
);

export default ai;