# ScribbleAI

A blackboard-style whiteboard where you can sketch an idea and ask Gemini to explain it. Draw a diagram, a flowchart, or a math problem, then ask "explain this" and the AI sees your drawing.

## Features

**Whiteboard**
- Freehand drawing with mouse, touch, or stylus (built on Pointer Events)
- Pen and eraser with an adjustable brush size and any colour
- Undo / redo, one step per stroke (Ctrl+Z, Ctrl+Shift+Z)
- Clear board
- Canvas resizes with the window without losing your drawing

**AI**
- Ask questions in plain text, like "what is binary search?"
- Optionally send your drawing along with the question (multimodal input)
- Short, simple bullet-point answers
- Loading state, error handling, Enter to submit

## How it works

```text
Canvas ──toDataURL("image/png")──► base64 image ─┐
                                                  ├──► Gemini API ──► explanation panel
Prompt text ─────────────────────────────────────┘
```

When "Include my drawing" is checked, the canvas is exported as a PNG and sent to Gemini together with the prompt. When it is unchecked, only the text is sent.

Undo/redo works by saving a canvas snapshot (`ImageData`) after each stroke and moving a pointer through that list. History is capped at 30 snapshots.

## Tech stack

React, Vite, HTML Canvas, Tailwind CSS, Lucide Icons, Google Gemini API (`@google/genai`)

## Project structure

```text
src/
├── App.jsx
├── gemini.js                  # Gemini client
├── components/
│   ├── Toolbar.jsx            # colour, pen, eraser, size, undo/redo, clear
│   └── AskAI.jsx              # prompt box, Gemini call, answer panel
└── hooks/
    └── useWhiteboard.js       # all canvas logic: drawing, history, resize
```

## Run it locally

```bash
git clone https://github.com/inimai09/ScribbleAi.git
cd ScribbleAi
npm install
```

Create a `.env` file in the project root:

```text
VITE_GEMINI_API_KEY=your_key_here
```

Get a free key from [Google AI Studio](https://aistudio.google.com/). Then:

```bash
npm run dev
```

## A note on the API key

Vite bundles any `VITE_` variable into the browser code, so the key is visible to anyone who opens DevTools. This is fine for a local demo. For a public deployment, restrict the key to your domain in Google Cloud Console and set a usage quota, or route requests through a small backend so the key never reaches the browser.

## Known limitations and ideas

- The eraser paints in the background colour (the board is a solid black canvas)
- Undo history resets when the window is resized
- Ideas: save/export as PNG, shapes and text tools, pressure-sensitive strokes, chat history with the AI
