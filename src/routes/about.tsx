import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Maison Estates" },
      {
        name: "description",
        content: "Twenty-five years of placing people in homes they love. Meet the agency behind Maison Estates.",
      },
      { property: "og:title", content: "About — Maison Estates" },
      { property: "og:description", content: "Twenty-five years of placing people in homes they love." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About us</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight md:text-7xl">
        We sell <em>fewer</em> homes — <br className="hidden md:inline" />
        and care more about each one.
      </h1>
      <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          Maison Estates was founded in Paris in 1998 with a simple idea: that buying a home should
          feel like an unhurried conversation, not a sales call. Twenty-five years later, that
          principle still guides every viewing, every contract, every key handed over.
        </p>
        <p>
          Our portfolio spans from quiet stone villas in the Tuscan hills to glass penthouses above
          Manhattan. What ties them together is a feeling — a sense that someone, somewhere, is
          about to begin a chapter here.
        </p>
        <p>
          In 2024, we introduced Aria, a voice concierge built into every page. She helps you
          search out loud, asks the right follow-up questions, and quietly hands you over to a
          human agent the moment you'd like one.
        </p>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-3">
        {[
          { n: "25+", l: "years in business" },
          { n: "12", l: "countries" },
          { n: "3,400+", l: "homes placed" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-secondary/40 p-8 text-center">
            <div className="font-serif text-5xl text-primary">{s.n}</div>
            <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
