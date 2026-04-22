import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Maison Estates" },
      {
        name: "description",
        content: "Speak to a senior agent at Maison Estates, or schedule a private viewing.",
      },
      { property: "og:title", content: "Contact — Maison Estates" },
      { property: "og:description", content: "Speak to a senior agent or schedule a viewing." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">Let's talk.</h1>
        <p className="mt-6 max-w-md text-muted-foreground">
          Tell us a little about what you're looking for and a senior agent will reach out within
          one business day. Prefer to talk now? Tap the microphone — Aria is on duty.
        </p>
        <div className="mt-12 space-y-6 text-sm">
          <Detail label="Email" value="concierge@maisonestates.com" />
          <Detail label="Phone" value="+33 1 84 88 19 00" />
          <Detail label="Office" value="Boulevard Haussmann 142, 75008 Paris" />
        </div>
      </div>

      <div className="rounded-2xl bg-secondary/40 p-8 md:p-10">
        {submitted ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="font-serif text-3xl">Thank you.</div>
            <p className="mt-3 text-sm text-muted-foreground">
              An agent will reach out within one business day.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-5"
          >
            <FormField label="Your name">
              <input required className="w-full rounded-lg bg-background px-4 py-3 text-sm outline-none" />
            </FormField>
            <FormField label="Email">
              <input required type="email" className="w-full rounded-lg bg-background px-4 py-3 text-sm outline-none" />
            </FormField>
            <FormField label="Phone (optional)">
              <input type="tel" className="w-full rounded-lg bg-background px-4 py-3 text-sm outline-none" />
            </FormField>
            <FormField label="What are you looking for?">
              <textarea
                required
                rows={4}
                className="w-full resize-none rounded-lg bg-background px-4 py-3 text-sm outline-none"
                placeholder="A villa in Tuscany, a penthouse in NYC, somewhere quiet…"
              />
            </FormField>
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3 text-xs font-medium uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
            >
              Request a callback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-foreground">{value}</div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
