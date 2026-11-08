"use client";

import { useCallback, useRef, useState } from "react";

export type SpeechStatus = "idle" | "speaking" | "listening";

export function useSpeech() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [status, setStatus] = useState<SpeechStatus>("idle");

  const supported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition) &&
    "speechSynthesis" in window;

  const speak = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.onend = () => {
        setStatus("idle");
        resolve();
      };
      utterance.onerror = () => {
        setStatus("idle");
        resolve();
      };
      setStatus("speaking");
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Resolves with the heard transcript, or "" on silence/error/timeout.
  const listen = useCallback((timeoutMs = 8000) => {
    return new Promise<string>((resolve) => {
      const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Ctor) {
        resolve("");
        return;
      }

      const recognition = new Ctor();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let settled = false;
      const finish = (transcript: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        setStatus("idle");
        resolve(transcript);
      };

      const timeout = setTimeout(() => {
        recognition.stop();
        finish("");
      }, timeoutMs);

      recognition.onresult = (event) => {
        finish(event.results[0]?.[0]?.transcript ?? "");
      };
      recognition.onerror = () => finish("");
      recognition.onend = () => finish("");

      setStatus("listening");
      recognition.start();
    });
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setStatus("idle");
  }, []);

  return { supported, status, speak, listen, stop };
}
