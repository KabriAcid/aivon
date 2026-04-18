export type SupportedLanguage = "English" | "Hausa" | "Yoruba" | "Igbo";

export interface ProcessRequest {
  text: string;
  language: SupportedLanguage;
}

export interface ProcessResponse {
  response: string;
  source: "llm" | "fallback";
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function processCall(
  payload: ProcessRequest,
): Promise<ProcessResponse> {
  const res = await fetch(`${API_BASE}/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to process call: ${res.status}`);
  }

  return (await res.json()) as ProcessResponse;
}
