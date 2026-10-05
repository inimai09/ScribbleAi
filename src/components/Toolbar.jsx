
import { Eraser, Pencil, Redo2, Trash2, Undo2 } from "lucide-react";

function ToolButton({ label, onClick, active = false, disabled = false, danger = false, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition-all duration-200 ${active ? "bg-zinc-700" : ""} ${danger ? "hover:bg-red-500" : "hover:bg-zinc-700"} ${disabled ? "cursor-not-allowed opacity-30" : "hover:scale-105"}`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div className="mx-1 h-8 w-px bg-zinc-700" />;

export default function Toolbar({ board }) {
  const { tool, setTool, color, setColor, size, setSize, undo, redo, canUndo, canRedo, clear } = board;

  return (
    <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900/80 px-2 py-1 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-zinc-500">
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setTool("pen");
        }}
        title="Pen colour"
        aria-label="Pen colour"
        className="h-7 w-7 cursor-pointer rounded-lg bg-transparent"
      />

      <Divider />

      <ToolButton label="Pen" active={tool === "pen"} onClick={() => setTool("pen")}>
        <Pencil size={16} />
      </ToolButton>
      <ToolButton label="Eraser" active={tool === "eraser"} onClick={() => setTool("eraser")}>
        <Eraser size={16} />
      </ToolButton>

      <input
        type="range"
        min="1"
        max="24"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        title="Brush size"
        aria-label="Brush size"
        className="mx-2 w-20 cursor-pointer accent-blue-500"
      />

      <Divider />

      <ToolButton label="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton label="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}>
        <Redo2 size={16} />
      </ToolButton>

      <Divider />

      <ToolButton label="Clear board" onClick={clear} danger>
        <Trash2 size={16} />
      </ToolButton>
    </div>
  );
}
