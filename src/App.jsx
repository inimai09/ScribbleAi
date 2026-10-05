import AskAI from "./components/AskAI";
import Toolbar from "./components/Toolbar";
import useWhiteboard from "./hooks/useWhiteboard";

export default function App() {
  const board = useWhiteboard();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Toolbar board={board} />
      <AskAI getImageBase64={board.getImageBase64} />

      {/* touch-none stops the browser from scrolling while you draw on touch screens */}
      <canvas
        ref={board.canvasRef}
        className="block cursor-crosshair touch-none"
        {...board.pointerHandlers}
      />
    </div>
  );
}
