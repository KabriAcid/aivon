import os
import random
from typing import Dict, List, Tuple
from dotenv import load_dotenv

try:
    from openai import OpenAI
except Exception:
    OpenAI = None

load_dotenv()


FALLBACK_RESPONSES: Dict[str, List[str]] = {
    "English": [
        "Sure. For your farm, start by checking soil moisture this morning and irrigate lightly at sunset.",
        "I can help with that. Begin with clear signal checks, then restart your device and test in open space.",
        "Good question. Keep your request short, and I will guide you step by step.",
    ],
    "Hausa": [
        "Madalla. Ka fara da duba danshin kasa sannan ka yi ban ruwa da yamma kadan.",
        "Na gane. Don inganta network, ka sake kunna wayarka sannan ka gwada a wuri mai bude fili.",
        "Toh. Ka yi tambayarka a takaice, zan ba ka amsa cikin sauki.",
    ],
    "Yoruba": [
        "O dara. Bere nipa ayewo omi inu ile ki o si fun oko ni omi die ni ale.",
        "Mo gbo. Tun foonu bere, ki o si danwo nibi ti afefe ati ifihan dara.",
        "Beeni. So ibeere re ni kukuru, emi yoo dahun ni kedere.",
    ],
    "Igbo": [
        "O di mma. Bido na inyocha mmiri n'ala ugbo gi tupu i tinye mmiri obere n'uhuruchi.",
        "Aghotaram. Malite site n'inyogharia ekwentị gi ma nwalee n'ebe meghere emepe.",
        "Nke oma. Juo ajụjụ gị nkenke ka m nye gị azịza doro anya.",
    ],
}

DEMO_QUERY_HINTS: Dict[str, str] = {
    "agriculture": "Focus on practical farming steps for Nigerian conditions.",
    "network": "Focus on simple troubleshooting actions and escalation path.",
    "weather": "Give short weather-aware and irrigation-friendly advice.",
}


class AIService:
    def __init__(self) -> None:
        self.model = os.getenv("AI_MODEL", "gpt-4o-mini")
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key and OpenAI else None

    def _build_system_prompt(self, language: str) -> str:
        return (
            "You are Aivon, a Nigerian multilingual voice assistant. "
            f"Respond clearly and naturally in {language}. "
            "Keep responses short, conversational, and helpful for call-center style interactions."
        )

    def _infer_hint(self, text: str) -> str:
        lowered = text.lower()
        if "farm" in lowered or "agric" in lowered or "irrig" in lowered:
            return DEMO_QUERY_HINTS["agriculture"]
        if "network" in lowered or "signal" in lowered or "call drop" in lowered:
            return DEMO_QUERY_HINTS["network"]
        if "weather" in lowered or "rain" in lowered:
            return DEMO_QUERY_HINTS["weather"]
        return "Respond with practical next steps in under 2 sentences."

    def _fallback(self, language: str) -> Tuple[str, str]:
        options = FALLBACK_RESPONSES.get(language, FALLBACK_RESPONSES["English"])
        return random.choice(options), "fallback"

    def generate_response(self, text: str, language: str) -> Tuple[str, str]:
        if not self.client:
            return self._fallback(language)

        try:
            system_prompt = self._build_system_prompt(language)
            hint = self._infer_hint(text)
            completion = self.client.chat.completions.create(
                model=self.model,
                temperature=0.5,
                max_tokens=120,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "system", "content": hint},
                    {"role": "user", "content": text},
                ],
            )
            message = completion.choices[0].message.content or ""
            cleaned = message.strip()
            if not cleaned:
                return self._fallback(language)
            return cleaned, "llm"
        except Exception:
            return self._fallback(language)


ai_service = AIService()
