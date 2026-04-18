
# 🇳🇬 AI Voice Assistant MVP Development Guide (VoIP-first Approach)

This document explains how to build a **Nigerian-based AI voice assistant** that users can call or speak to using VoIP or phone calls. It covers the reasoning behind the architecture, relevant telecom background, and a practical MVP strategy using familiar web technologies.

---

## 🧠 Background

The initial idea was to let users **call an AI assistant via phone (PSTN)**. However, PSTN and telecom protocols (SIP, RTP, Asterisk, etc.) are complex and not beginner-friendly for web developers.

To simplify development, the project will start with a **VoIP-first MVP**, meaning calls happen **over the internet**, not traditional phone networks. Once the core system works, it can later integrate with telecom layers.

---

## ⚙️ Traditional Telecom vs VoIP Approach

### 1. Traditional Telecom Stack (MTN, Airtel, etc.)

| Layer | Description |
|-------|--------------|
| **PSTN** | Public Switched Telephone Network – real phone calls via carriers |
| **SIP (Session Initiation Protocol)** | Digital signaling system that connects and manages calls |
| **RTP (Real-Time Transport Protocol)** | Transmits the actual voice/audio data |
| **PBX (Private Branch Exchange)** | A system like **Asterisk** that manages calls |
| **AI Backend** | Receives audio, converts to text, generates responses, converts back to speech |

This setup requires telecom-grade configuration, including **SIP trunks**, **firewall ports**, **codecs**, and **dialplans**.

---

### 2. Simplified MVP Using VoIP (Internet-Based)

Instead of dealing with carriers, calls are handled over the internet using your own app or website.

```
User (Mic) → React Frontend → Node.js Backend → OpenAI APIs (STT, GPT, TTS)
```

This method uses familiar web technologies (React, TypeScript, Node.js) and avoids telecom configuration.

---

## 🧱 System Architecture (MVP)

```
🎙️ User speaks via browser mic
     ↓
🎧 React frontend streams audio (WebSocket/WebRTC)
     ↓
🧠 Node.js backend
     ↓
🗣️ OpenAI Whisper API (speech-to-text)
     ↓
💬 GPT-4o-mini (AI logic + reasoning)
     ↓
🔊 OpenAI TTS or ElevenLabs (text-to-speech)
     ↓
🔁 Audio stream returned to browser for playback
```

Everything runs on free-tier cloud services during MVP.

---

## 🧰 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React + TypeScript |
| Backend | Node.js + Express + WebSocket |
| Speech-to-Text | OpenAI Whisper API |
| AI Brain | GPT-4o-mini |
| Text-to-Speech | OpenAI TTS or ElevenLabs |
| Hosting | Vercel (frontend), Railway or Render (backend) |

---

## 💵 OpenAI API Pricing (with ₦ Naira Estimates)

| Service | USD Price | Approx ₦ (₦2,000/USD) | Description |
|----------|------------|------------------------|--------------|
| **Speech-to-Text (Whisper)** | $0.006/min | ₦12/min | Converts voice → text |
| **GPT-4o input tokens** | $2.50 / 1M tokens | ₦5,000 | User speech processing |
| **GPT-4o output tokens** | $10 / 1M tokens | ₦20,000 | AI’s generated responses |
| **Text-to-Speech (TTS)** | $15 / 1M characters | ₦30,000 | Converts text → audio |

### Example per 1-minute conversation:
- STT = ₦12  
- GPT processing = ~₦100–₦200 (small query)  
- TTS = ~₦6  
**≈ ₦120–₦250 per short call** (depending on token usage).

---

## 💰 Free APIs and Tools for Testing

| Provider | Service | Free Tier |
|-----------|----------|-----------|
| **OpenAI** | STT + GPT + TTS | $5–$10 free credit for new users |
| **ElevenLabs** | Realistic TTS | 10,000 free characters/month |
| **AssemblyAI** | STT alternative | 5 hours free/month |
| **Groq Cloud** | Llama 3.1 / Mixtral LLMs | Free daily quota |
| **Railway / Render / Vercel** | Hosting | Free deployment tiers |

You can fully build and test your MVP with **₦0 initial cost** using these free tiers.

---

## 🧩 Future Expansion (When Ready for Real Phone Calls)

When the MVP is successful and you want users to call via normal phone numbers:

1. **Buy a Cloud DID Number** (from DIDLogic, iPNX, etc.)  
2. **Deploy Asterisk or FreeSWITCH** in the cloud.  
3. **Forward your MTN line** to that DID.  
4. **Connect Asterisk ↔ AI backend** for live calls.  

That’s when you’ll enter the telecom space properly — but your **AI logic won’t change**.

---

## 🚀 MVP Goal

- ✅ Build a working **voice AI web app** (VoIP-based).  
- ✅ Use OpenAI’s APIs for speech and logic.  
- ✅ Test voice conversations in real-time.  
- ✅ Keep cost near ₦0 during development.  
- ✅ Later extend to SIP/PSTN integration.

---

## 📘 Next Steps

1. Create your OpenAI account and get your API key.  
2. Set up your Node.js backend (Express + WebSocket).  
3. Connect to OpenAI Whisper, GPT-4o-mini, and TTS.  
4. Build a React interface with microphone access.  
5. Deploy frontend on Vercel, backend on Railway.  
6. Start voice-testing your AI MVP! 🎧

---

## 🧾 Summary

- Traditional telecom (MTN, PSTN, SIP) is complex but can be layered later.  
- MVP should start VoIP-first (internet calls).  
- Use OpenAI’s STT, LLM, and TTS to power real-time AI voice chat.  
- Free tiers are enough for building and testing.  
- Future versions can easily integrate with real phone networks.

---

**Author:** Harun Kabri (AI Voice Assistant Project — MVP Plan)  
**Compiled with guidance from ChatGPT (GPT-5)**

