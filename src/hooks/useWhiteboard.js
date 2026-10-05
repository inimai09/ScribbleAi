import { useCallback, useEffect, useRef, useState } from "react";

const BACKGROUND = "#000000";
const MAX_HISTORY = 30;
const ERASER_MULTIPLIER = 3; // eraser is 3x wider than the pen

export default function useWhiteboard() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  // Undo/redo: a list of canvas snapshots plus a pointer to the current one
  const history = useRef([]);
  const historyIndex = useRef(-1);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(4);
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });

  const getCtx = () =>
    canvasRef.current.getContext("2d", { willReadFrequently: true });

  const fillBackground = (ctx, canvas) => {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const syncFlags = useCallback(() => {
    setFlags({
      canUndo: historyIndex.current > 0,
      canRedo: historyIndex.current < history.current.length - 1,
    });
  }, []);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const snapshot = getCtx().getImageData(0, 0, canvas.width, canvas.height);

    // Drawing after an undo throws away the "redo" future
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(snapshot);

    if (history.current.length > MAX_HISTORY) history.current.shift();
    historyIndex.current = history.current.length - 1;
    syncFlags();
  }, [syncFlags]);

  const resetHistory = useCallback(() => {
    history.current = [];
    historyIndex.current = -1;
    saveSnapshot();
  }, [saveSnapshot]);

  // Size the canvas to the window and keep the drawing when the window resizes
  useEffect(() => {
    const canvas = canvasRef.current;

    const resize = () => {
      const ctx = getCtx();

      let copy = null;
      if (canvas.width > 0 && canvas.height > 0) {
        copy = document.createElement("canvas");
        copy.width = canvas.width;
        copy.height = canvas.height;
        copy.getContext("2d").drawImage(canvas, 0, 0);
      }

      canvas.width = window.innerWidth; // resizing clears the canvas...
      canvas.height = window.innerHeight;
      fillBackground(ctx, canvas);
      if (copy) ctx.drawImage(copy, 0, 0); // ...so paint the old drawing back

      resetHistory(); // old snapshots have the wrong size now
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resetHistory]);

  const undo = useCallback(() => {
    if (historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    getCtx().putImageData(history.current[historyIndex.current], 0, 0);
    syncFlags();
  }, [syncFlags]);

  const redo = useCallback(() => {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current += 1;
    getCtx().putImageData(history.current[historyIndex.current], 0, 0);
    syncFlags();
  }, [syncFlags]);

  const clear = useCallback(() => {
    fillBackground(getCtx(), canvasRef.current);
    saveSnapshot();
  }, [saveSnapshot]);

  // Ctrl/Cmd+Z = undo, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y = redo
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (!(e.ctrlKey || e.metaKey)) return;

      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  // Pointer events cover mouse, touch and stylus with one set of handlers
  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawSegment = (from, to) => {
    const ctx = getCtx();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? BACKGROUND : color;
    ctx.lineWidth = tool === "eraser" ? size * ERASER_MULTIPLIER : size;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const onPointerDown = (e) => {
    canvasRef.current.setPointerCapture(e.pointerId); // keep drawing if the pointer leaves the canvas
    isDrawing.current = true;

    const point = getPoint(e);
    lastPoint.current = point;
    drawSegment(point, { x: point.x + 0.01, y: point.y }); // a click makes a dot
  };

  const onPointerMove = (e) => {
    if (!isDrawing.current) return;

    const point = getPoint(e);
    drawSegment(lastPoint.current, point);
    lastPoint.current = point;
  };

  const endStroke = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    saveSnapshot(); // one undo step per stroke
  };

  // The drawing as a base64 PNG, ready to send to Gemini
  const getImageBase64 = () =>
    canvasRef.current.toDataURL("image/png").split(",")[1];

  return {
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    size,
    setSize,
    canUndo: flags.canUndo,
    canRedo: flags.canRedo,
    undo,
    redo,
    clear,
    getImageBase64,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endStroke,
      onPointerCancel: endStroke,
    },
  };
}
