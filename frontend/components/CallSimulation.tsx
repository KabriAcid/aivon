"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  processCall,
  type ProcessResponse,
  type SupportedLanguage,
} from "@/lib/api";
import { processCallStreaming } from "@/lib/ws";
import { useCallTimer } from "@/hooks/useCallTimer";

type CallStatus = "Connecting" | "Active" | "Ended";
type Speaker = "user" | "assistant";

interface TranscriptMessage {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: string;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

const demoQueries = [
  "I need guidance for tomato farming this season.",
  "How can I improve mobile network quality in my area?",
  "Tell me today's weather and irrigation plan advice.",
];

const languageToSpeechCode: Record<SupportedLanguage, string> = {
  English: "en-NG",
  Hausa: "ha-NG",
  Yoruba: "yo-NG",
  Igbo: "ig-NG",
};

const labels = ["Speech-to-Text", "AI Processing", "Text-to-Speech"];

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function playTone(type: "start" | "end") {
  if (typeof window === "undefined") {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = type === "start" ? 720 : 260;
  gain.gain.value = 0.05;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
}

export default function CallSimulation() {
  const [callStatus, setCallStatus] = useState<CallStatus>("Connecting");
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("English");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [streamDraft, setStreamDraft] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [caller] = useState(
    `+234 80${Math.floor(10000000 + Math.random() * 89999999)}`,
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const { formatted, reset } = useCallTimer(callStatus === "Active");

  const recognitionSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCallStatus("Active");
      playTone("start");
      setTranscript([
        {
          id: crypto.randomUUID(),
          speaker: "assistant",
          text: "Welcome to Aivon. I am ready to help you now.",
          timestamp: nowTime(),
        },
      ]);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    if (!recognitionSupported) {
      return;
    }

    const RecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionCtor) {
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = languageToSpeechCode[selectedLanguage];

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0]?.[0]?.transcript?.trim();
      if (result) {
        handleUserText(result);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setSpeechError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [selectedLanguage, recognitionSupported]);

  function speakResponse(text: string) {
    if (typeof window === "undefined") {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageToSpeechCode[selectedLanguage];
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  async function handleUserText(text: string) {
    if (callStatus !== "Active") {
      return;
    }

    setTranscript((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        speaker: "user",
        text,
        timestamp: nowTime(),
      },
    ]);

    setAiThinking(true);
    setStreamDraft("");

    try {
      let response: ProcessResponse;
      try {
        response = await processCallStreaming(
          { text, language: selectedLanguage },
          (chunk) => setStreamDraft((prev) => `${prev} ${chunk}`.trim()),
        );
      } catch {
        setStreamDraft("");
        response = await processCall({ text, language: selectedLanguage });
      }

      setTranscript((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          speaker: "assistant",
          text: response.response,
          timestamp: nowTime(),
        },
      ]);
      setStreamDraft("");
      speakResponse(response.response);
    } catch (error) {
      const fallback =
        selectedLanguage === "Hausa"
          ? "Na fahimta. Don Allah ka sake maimaita tambayarka a takaice."
          : "I understand. Please repeat your question briefly.";

      setTranscript((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          speaker: "assistant",
          text: fallback,
          timestamp: nowTime(),
        },
      ]);
      setStreamDraft("");
      speakResponse(fallback);
      setSpeechError(
        error instanceof Error ? error.message : "Unknown processing error",
      );
    } finally {
      setAiThinking(false);
    }
  }

  function toggleMic() {
    setSpeechError(null);

    if (!recognitionSupported || !recognitionRef.current) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    if (callStatus !== "Active") {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.lang = languageToSpeechCode[selectedLanguage];
    recognitionRef.current.start();
    setIsListening(true);
  }

  function endCall() {
    recognitionRef.current?.stop();
    setIsListening(false);
    setCallStatus("Ended");
    playTone("end");
    reset();
  }

  const statusClass = useMemo(() => {
    if (callStatus === "Active") {
      return "text-aivon-accent";
    }
    if (callStatus === "Ended") {
      return "text-rose-300";
    }
    return "text-amber-300";
  }, [callStatus]);

  return (
    <main className="grid-pattern min-h-screen p-4 text-white md:p-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Aivon Call Simulation
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-aivon-muted"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-aivon-muted"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_2fr_1.1fr]">
          <aside className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              Caller
            </p>
            <p className="mt-3 text-xl">{caller}</p>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
                Status
              </p>
              <p className={`mt-2 text-lg font-semibold ${statusClass}`}>
                {callStatus}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
                Call Timer
              </p>
              <p className="mt-2 text-2xl font-semibold">{formatted}</p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="language"
                className="text-xs uppercase tracking-[0.2em] text-aivon-muted"
              >
                Language
              </label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) =>
                  setSelectedLanguage(e.target.value as SupportedLanguage)
                }
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {(
                  ["Hausa", "Yoruba", "Igbo", "English"] as SupportedLanguage[]
                ).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
                Demo Queries
              </p>
              {demoQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => handleUserText(query)}
                  className="w-full rounded-xl border border-white/15 px-3 py-2 text-left text-sm text-white/90 transition hover:border-aivon-accent"
                >
                  {query}
                </button>
              ))}
            </div>
          </aside>

          <section className="glass flex min-h-[550px] flex-col rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              Live Transcript
            </p>

            <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
              {transcript.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.speaker === "user"
                      ? "ml-auto bg-aivon-accent/20 text-white"
                      : "bg-white/10 text-white/95"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-aivon-muted">
                    {msg.timestamp}
                  </p>
                </motion.div>
              ))}

              {aiThinking && (
                <div className="max-w-[70%] rounded-2xl bg-white/10 px-4 py-3 text-sm text-aivon-muted">
                  {streamDraft || "AI is thinking..."}
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-aivon-muted">
                Voice Waveform
              </p>
              <div className="flex h-16 items-end gap-1 rounded-2xl border border-white/10 px-3 py-2">
                {Array.from({ length: 36 }).map((_, index) => (
                  <span
                    key={index}
                    className={`w-1 rounded-full bg-aivon-accent ${isListening || aiThinking ? "animate-pulseSoft" : "opacity-35"}`}
                    style={{
                      height: `${20 + ((index * 13) % 35)}px`,
                      animationDelay: `${index * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              System Status
            </p>

            <div className="mt-4 space-y-3">
              {labels.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3"
                >
                  <span className="text-sm text-white/90">{label}</span>
                  <span className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-aivon-accent">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-aivon-accent" />
                    Active
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={toggleMic}
                disabled={callStatus !== "Active"}
                className="w-full rounded-xl bg-aivon-accent px-4 py-3 text-sm font-semibold text-[#04110c] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isListening ? "Stop Recording" : "Start Recording"}
              </button>

              <button
                onClick={endCall}
                disabled={callStatus === "Ended"}
                className="w-full rounded-xl border border-rose-300/50 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                End Call
              </button>
            </div>

            {!recognitionSupported && (
              <p className="mt-4 text-xs text-amber-300">
                Speech recognition unavailable in this browser. Use demo queries
                to test.
              </p>
            )}

            {speechError && (
              <p className="mt-4 text-xs text-rose-300">{speechError}</p>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
