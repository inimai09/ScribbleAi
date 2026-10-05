
import { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import ai from "../gemini";

const MODEL = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION =
  "You are a friendly tutor inside a whiteboard app. " +
  "Explain things in short, simple bullet points. " +
  "If an image of the whiteboard is provided, describe what the user drew and answer their question about it.";

export default function AskAI({ getImageBase64 }) {
  const [prompt, setPrompt] = useState("");
  const [includeDrawing, setIncludeDrawing] = useState(true);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const parts = [];

      if (includeDrawing) {
        parts.push({ inlineData: { mimeType: "image/png", data: getImageBase64() } });
      }
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: parts,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      setAnswer(response.text || "The AI returned an empty response.");
    } catch (err) {
      console.error("Gemini error:", err);
      setError("Something went wrong talking to the AI. Check your API key and connection, then try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasOutput = answer || error;

  return (
    <div className="fixed right-5 top-5 z-50 flex w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2 text-white outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={askAI}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          AI
        </button>
      </div>

      <label className="flex cursor-pointer items-center gap-2 self-end text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={includeDrawing}
          onChange={(e) => setIncludeDrawing(e.target.checked)}
          className="accent-blue-500"
        />
        Include my drawing
      </label>

      {hasOutput && (
        <div
          className={`relative max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-xl border bg-zinc-900/90 p-4 pr-9 text-white ${error ? "border-red-500/60" : "border-zinc-700"}`}
        >
          <button
            type="button"
            aria-label="Close answer"
            onClick={() => {
              setAnswer("");
              setError("");
            }}
            className="absolute right-2 top-2 rounded p-1 text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
          {error || answer}
        </div>
      )}
    </div>
  );
}
