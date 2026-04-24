import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

// Minimal types for Web Speech API (not in lib.dom by default)
type SRConstructor = new () => SpeechRecognitionInstance;
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Aria, your concierge at Maison Estates. Tell me what you're looking for — a city apartment, a beachfront villa, somewhere quiet?",
    },
  ]);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSupported(!!getSR() && typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, interim, thinking]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Prefer a natural English female voice if available
    const preferred =
      voices.find((v) => /Samantha|Karen|Victoria|Google US English|Jenny/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;
    utter.rate = 1.02;
    utter.pitch = 1.05;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const sendToAI = useCallback(
    async (text: string) => {
      const userMsg: Msg = { role: "user", content: text };
      const next = [...messages, userMsg];
      setMessages(next);
      setThinking(true);
      try {
        const { data, error } = await supabase.functions.invoke("chat", {
          body: { messages: next },
        });
        if (error) {
          const status = (error as { context?: { status?: number } }).context?.status;
          const errText =
            status === 429
              ? "I'm getting a lot of calls right now — give me a moment and try again."
              : status === 402
                ? "Our AI service needs a top-up. Please reach out to our team directly."
                : "I had trouble connecting just now. Mind trying that again?";
          setMessages((m) => [...m, { role: "assistant", content: errText }]);
          speak(errText);
          return;
        }
        const reply =
          (data as { reply?: string })?.reply?.trim() ||
          "I'm not sure I caught that — could you say it again?";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        speak(reply);
      } catch {
        const fallback = "I lost the connection for a second. Please try again.";
        setMessages((m) => [...m, { role: "assistant", content: fallback }]);
      } finally {
        setThinking(false);
      }
    },
    [messages, speak],
  );

  const startListening = useCallback(() => {
    const SR = getSR();
    if (!SR) return;
    stopSpeaking();
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    let finalText = "";
    rec.onresult = (e) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      setInterim(interimText);
    };
    rec.onerror = () => {
      setListening(false);
      setInterim("");
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
      const text = finalText.trim();
      if (text) void sendToAI(text);
    };
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }, [sendToAI, stopSpeaking]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open voice concierge"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant transition-transform hover:scale-105 md:bottom-8 md:right-8"
      >
        <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-pulse-ring" />
        <MicIcon className="h-6 w-6" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-end p-0 md:inset-auto md:bottom-28 md:right-8">
          <div className="flex h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-elegant md:h-[600px] md:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-secondary/40 px-5 py-4">
              <div>
                <div className="font-serif text-xl">Aria</div>
                <div className="text-xs text-muted-foreground">
                  {speaking
                    ? "Speaking…"
                    : listening
                      ? "Listening…"
                      : thinking
                        ? "Thinking…"
                        : "Voice concierge"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  stopSpeaking();
                  setOpen(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                      : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm text-foreground"
                  }
                >
                  {m.content}
                </div>
              ))}
              {interim && (
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/60 px-4 py-3 text-sm italic text-primary-foreground">
                  {interim}
                </div>
              )}
              {thinking && (
                <div className="mr-auto flex max-w-[85%] gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                  <Dot delay="0s" />
                  <Dot delay="0.15s" />
                  <Dot delay="0.3s" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="border-t border-border/60 bg-secondary/30 px-5 py-4">
              {!supported ? (
                <p className="text-center text-xs text-muted-foreground">
                  Voice not supported in this browser. Try Chrome.
                </p>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  {speaking && (
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      className="rounded-full border border-border bg-background px-4 py-2 text-xs uppercase tracking-wider text-foreground hover:bg-muted"
                    >
                      Stop speaking
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={listening ? stopListening : startListening}
                    disabled={thinking}
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                      listening
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    } disabled:opacity-50`}
                    aria-label={listening ? "Stop" : "Speak"}
                  >
                    {listening && (
                      <span className="absolute inset-0 rounded-full bg-destructive opacity-50 animate-pulse-ring" />
                    )}
                    <MicIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                {listening ? "Tap to stop" : "Tap to speak with Aria"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" strokeLinecap="round" />
      <path d="M12 18v3" strokeLinecap="round" />
    </svg>
  );
}
