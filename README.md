# ✨ Scribble AI

An interactive **AI-powered whiteboard** that lets you draw freely on a digital canvas and ask an AI tutor questions about your drawing.

Scribble AI combines a browser-based HTML Canvas whiteboard with **Google Gemini**, allowing users to send their drawing along with a question and receive a simple AI-generated explanation.

---

## 🚀 Features

* 🖊️ **Digital Whiteboard**

  * Draw directly on the canvas using your mouse, touch, or stylus.
  * Smooth freehand drawing.

* 🎨 **Drawing Tools**

  * Pen tool
  * Eraser
  * Custom pen color
  * Adjustable brush size

* ↩️ **Undo & Redo**

  * Undo and redo previous drawing strokes.
  * Supports keyboard shortcuts:

    * `Ctrl/Cmd + Z` → Undo
    * `Ctrl/Cmd + Shift + Z` → Redo
    * `Ctrl/Cmd + Y` → Redo

* 🗑️ **Clear Board**

  * Quickly remove everything from the whiteboard.

* 🤖 **AI Tutor**

  * Ask Gemini questions about your drawing.
  * Optionally send the current whiteboard drawing along with the question.
  * AI responses are displayed directly inside the application.

* 📸 **Canvas → Image**

  * The current canvas is converted into a PNG image.
  * The image is encoded as Base64 before being sent to Gemini.

* 📱 **Pointer Support**

  * Uses pointer events so the drawing system can work with mouse, touch, and stylus input.

---

## 🏗️ Architecture

The project is divided into separate responsibilities so that the UI, whiteboard logic, and AI communication remain independent.

```text
                         Scribble AI
                             │
                             ▼
                      React Application
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
        Toolbar.jsx                    AskAI.jsx
              │                             │
              │                             ▼
              │                         gemini.js
              │                             │
              ▼                             ▼
       useWhiteboard.js              Gemini API
              │                             │
              ▼                             ▼
           Canvas                       AI Response
              │                             │
              └──────────────┬──────────────┘
                             ▼
                           User
```

### Component Responsibilities

| File               | Responsibility                                                 |
| ------------------ | -------------------------------------------------------------- |
| `AskAI.jsx`        | AI input, loading state, errors, and displaying responses      |
| `Toolbar.jsx`      | Pen, eraser, color, brush size, undo, redo, and clear controls |
| `useWhiteboard.js` | Core whiteboard drawing logic and canvas state                 |
| `gemini.js`        | Creates and exports the Gemini API client                      |

---

## 🔄 How It Works

### 1. Drawing

The user draws on the HTML Canvas.

```text
User moves pointer
       ↓
Pointer Event
       ↓
useWhiteboard.js
       ↓
Canvas 2D Context
       ↓
Line is drawn
```

The whiteboard tracks the previous pointer position and draws small line segments between consecutive points.

---

### 2. Undo / Redo

After completing a drawing stroke, the current canvas is saved as a snapshot.

```text
Drawing
   ↓
Canvas Snapshot
   ↓
History Array
```

Undo moves backward through the snapshot history, while redo moves forward.

A maximum of **30 history states** is maintained.

---

### 3. Sending the Drawing to AI

When the user asks Gemini a question, the application can optionally include the current drawing.

```text
Canvas
  ↓
toDataURL("image/png")
  ↓
PNG image
  ↓
Base64 data
  ↓
Gemini API
```

The request can contain both:

```text
┌───────────────────────┐
│ Whiteboard image      │
├───────────────────────┤
│ User's question       │
└───────────────────────┘
             ↓
          Gemini
             ↓
       AI response
```

---

## 🤖 AI Request Flow

The AI component builds the request using the drawing and the user's question.

```text
User enters question
        ↓
      AskAI.jsx
        ↓
Include drawing?
     /       \
   Yes        No
    ↓          ↓
Canvas       Question
    ↓          │
Base64         │
    └────┬─────┘
         ↓
    Gemini API
         ↓
    AI Response
         ↓
    AskAI.jsx
         ↓
      Screen
```

The AI is given a system instruction to behave like a friendly tutor and explain concepts using short, simple bullet points.

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* HTML Canvas
* Tailwind CSS
* Vite

### AI

* Google Gemini
* `@google/genai`

### Icons

* Lucide React

---

## 📁 Project Structure

```text
scribble-ai/
│
├── src/
│   │
│   ├── components/
│   │   ├── AskAI.jsx
│   │   └── Toolbar.jsx
│   │
│   ├── hooks/
│   │   └── useWhiteboard.js
│   │
│   ├── gemini.js
│   │
│   └── ...
│
├── .env
├── package.json
└── README.md
```

## 🎯 Example Use Cases

Scribble AI can be used as an interactive learning tool.
<img width="1554" height="655" alt="image" src="https://github.com/user-attachments/assets/3cf0a081-d9dc-45fc-b7c3-f9c2a974b7a7" />


## 🧠 What This Project Demonstrates

This project is designed to demonstrate several practical frontend concepts:

* React component architecture
* React state management
* Custom React hooks
* HTML Canvas API
* Pointer Events
* Canvas image export
* Undo/redo state management
* API integration
* Multimodal AI requests
* Environment variables
* Separation of UI and business logic

---

## 📌 Project Status

🚧 **Currently under development**

The current version focuses on the core whiteboard functionality and Gemini-powered AI interaction.

---

## 👨‍💻 Author

**Inimai**

