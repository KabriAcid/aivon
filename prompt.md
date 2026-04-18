Alright — here’s a **production-quality prompt** you can give your AI builder. It’s structured so it generates a clean, modern, demo-ready system (not just random code).

---

# 🧠 FULL PROMPT (Use as-is)

Build a **modern, production-quality demo application** for a telecom AI project called **Aivon (AI Voice of Network)**.

## 🎯 Objective

Create a **realistic simulation** of a phone-call-based AI system where users “dial” a short code (e.g. 800) and interact with an AI using voice in real-time.

This is a **demo UI + working prototype**, not actual telecom integration.

---

## 🏗️ Tech Stack Requirements

### Frontend

* Framework: Next.js (latest App Router)
* Language: TypeScript
* Styling: Tailwind CSS
* UI: Premium, modern, dark-themed
* Animations: subtle (Framer Motion optional)

### Backend

* Language: Python
* Framework: FastAPI
* API: REST + WebSocket (for real-time simulation)

---

## 🎨 Design Requirements

* Dark mode by default
* Clean, minimal, “AI product” feel
* Large typography, smooth transitions
* Responsive (desktop-first, mobile-friendly)
* Use glassmorphism / soft shadows

---

## 🧩 Core Features to Implement

### 1. Landing Page

* Title: “Aivon — AI Voice of Network”
* Subtitle: “Dial. Speak. Get answers in your language.”
* CTA button: “Start Call Simulation”
* Visual flow:
  Dial → AI → Voice → Response

---

### 2. Call Simulation Screen (MAIN FEATURE)

Create a **real-time call interface UI**:

#### Layout:

* Left panel:

  * Caller number (fake)
  * Call status (Connecting, Active, Ended)
  * Language selector (Hausa, Yoruba, Igbo, English)

* Center panel:

  * Live transcript (chat-style)
  * Voice waveform animation (simulate if needed)

* Bottom:

  * Mic button (start/stop recording)
  * End call button

* Right panel:

  * System status indicators:

    * Speech-to-Text: active
    * AI Processing: active
    * Text-to-Speech: active

---

### 3. Voice Interaction

#### Frontend:

* Use browser Web Speech API for speech-to-text
* Capture user speech and send text to backend

#### Backend:

* Endpoint: `/process`
* Input: user text + selected language
* Output: AI-generated response

---

### 4. AI Processing (Backend)

* Integrate with an LLM API (configurable)
* Add prompt engineering:

  * AI should respond in selected Nigerian language
  * Keep responses short and conversational

Example system prompt:
“You are Aivon, a Nigerian multilingual voice assistant. Respond clearly and naturally in the user’s selected language.”

---

### 5. Text-to-Speech

Frontend:

* Use browser `speechSynthesis` to speak AI responses

---

### 6. WebSocket (Optional but preferred)

* Stream responses for “real-time” feel
* Simulate processing delay (500ms–1.5s)

---

### 7. Analytics Dashboard (Demo Data)

Create a simple dashboard page:

* Total calls today
* Average call duration
* Language distribution (bar chart)
* Recent queries list

Use mock data.

---

## 📡 Backend Structure (FastAPI)

* `/process` → POST → handles AI response
* `/health` → GET
* `/ws` → WebSocket (optional real-time)

Include:

* CORS setup
* Modular structure
* Clean architecture

---

## 🧪 Demo Optimization (IMPORTANT)

* Include fallback/mock responses if AI fails
* Predefine 2–3 strong demo queries (e.g. agriculture advice)
* Ensure Hausa responses work (even if partially hardcoded)

---

## 📁 Project Structure

Frontend:

* `/app`
* `/components`
* `/lib`
* `/hooks`

Backend:

* `/app`
* `/routes`
* `/services`
* `/schemas`

---

## ⚡ Extra Polish

* Loading states (“AI is thinking…”)
* Sound effects for call start/end
* Smooth transitions between states
* Fake phone call timer

---

## 🚀 Deliverables

* Fully working frontend + backend
* Clear setup instructions
* Environment variables for API keys
* Clean, readable, production-level code

---

# 🔥 Optional Add-on (if AI builder is strong)

Add:

* Language auto-detection
* Voice selection (male/female)
* Save call history

---

## 🧠 Final Note (you should know)

When you run this:

* It will feel like a real product
* Even without telecom integration

That’s exactly what you need for your presentation.

---

If you want next step, I can:

* Review the generated code
* Or refine it into a **pitch-ready live demo flow (script + timing)**
