import { useRef, useEffect, useState } from "react";
import ai from "./gemini";
import {
  Eraser,
  Trash2,
  Pencil,
  Palette
} from "lucide-react";

export default function App() {

const testAI = async () => {
  try {
    setLoading(true);
    setAnswer("Thinking...");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    setAnswer(response.text || "No response from AI");

  } catch (error) {
    console.log("ERROR:", error);
    setAnswer("AI failed — check console");
  } finally {
    setLoading(false);
  }
};
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [tool, setTool] = useState("pen");
  const [prompt, setPrompt] = useState("");
const [answer, setAnswer] = useState("");
const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineCap = "round";
    ctx.lineWidth = 3;
  }, []);

  const startDraw = (e) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.strokeStyle = tool === "eraser" ? "black" : color;

    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");

    if (tool === "eraser") {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 40; // eraser size aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3; // pen size 
  }
    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    ctx.stroke();
  };

  const stopDraw = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
  <div className="relative">

    <div
      className="
        fixed top-5 left-1/2 -translate-x-1/2

        flex items-center gap-2

        px-3 py-2

        bg-zinc-900/80
        backdrop-blur-md

        border border-zinc-700

        rounded-xl

        shadow-[0_8px_30px_rgba(0,0,0,0.6)]

        hover:border-zinc-500
        transition-all duration-300

        z-50
      "
    >
      <div
        className="
          p-2
          rounded-lg
          hover:bg-zinc-800
          transition-all duration-200
        "
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="
            w-10 h-10
            cursor-pointer
            rounded-lg
          "
        />
      </div>

      <div className="w-px h-8 bg-zinc-700" />

      <button
        onClick={() => setTool("pen")}
        className={`
          w-10 h-10
          rounded-lg

          flex items-center justify-center

          text-white

          hover:bg-zinc-700
          hover:scale-105

          transition-all duration-200

          ${tool === "pen" ? "bg-zinc-700" : ""}
        `}
      >
        <Pencil size={20} />
      </button>

      <button
        onClick={() => setTool("eraser")}
        className={`
          w-10 h-10
          rounded-lg

          flex items-center justify-center

          text-white

          hover:bg-zinc-700
          hover:scale-105

          transition-all duration-200

          ${tool === "eraser" ? "bg-zinc-700" : ""}
        `}
      >
        <Eraser size={20} />
      </button>

      <button
        onClick={clearCanvas}
        className="
          w-10 h-10
          rounded-lg

          flex items-center justify-center

          text-white

          hover:bg-red-500
          hover:scale-105

          transition-all duration-200
        "
      >
        <Trash2 size={20} />
      </button>
    </div>

    <div className="fixed top-5 right-5 flex items-center gap-2 z-50">
      <input
        type="text"
        placeholder="Ask AI..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="
          w-72
          px-4 py-2

          rounded-xl

          bg-zinc-900/90
          text-white

          border border-zinc-700

          outline-none

          focus:border-blue-500
        "
      />

      <button
        onClick={testAI}
        className="
          px-4 py-2

          rounded-xl

          bg-blue-600
          text-white

          hover:bg-blue-500
          hover:scale-105

          transition-all duration-200
        "
      >
        AI
      </button>
    </div>

    {answer && (
      <div
        className="
          fixed
          top-20
          right-5

          w-80

          bg-zinc-900/90
          text-white

          p-4

          rounded-xl

          border border-zinc-700

          z-50
        "
      >
        {answer}
      </div>
    )}

    <canvas
      ref={canvasRef}
      className="block"
      onMouseDown={startDraw}
      onMouseMove={draw}
      onMouseUp={stopDraw}
    />
  </div>
);
}