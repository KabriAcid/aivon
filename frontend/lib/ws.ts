import type { ProcessRequest, ProcessResponse } from "@/lib/api";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";

interface WsEvent {
  type: "status" | "chunk" | "final" | "error";
  value?: string;
  response?: string;
  source?: "llm" | "fallback";
  message?: string;
}

export function processCallStreaming(
  payload: ProcessRequest,
  onChunk: (chunk: string) => void,
): Promise<ProcessResponse> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      socket.send(JSON.stringify(payload));
    };

    socket.onerror = () => {
      socket.close();
      reject(new Error("WebSocket processing failed"));
    };

    socket.onmessage = (event) => {
      let data: WsEvent;
      try {
        data = JSON.parse(event.data) as WsEvent;
      } catch {
        return;
      }

      if (data.type === "chunk" && data.value) {
        onChunk(data.value);
      }

      if (data.type === "error") {
        socket.close();
        reject(new Error(data.message || "WebSocket error"));
      }

      if (data.type === "final" && data.response && data.source) {
        socket.close();
        resolve({ response: data.response, source: data.source });
      }
    };
  });
}
