import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-villa.jpg";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/PropertyCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Estates — Curated luxury homes worldwide" },
      {
        name: "description",
        content:
          "From city penthouses to beachfront villas, discover homes worth living in. Talk to Aria, your AI concierge.",
      },
      { property: "og:title", content: "Maison Estates — Curated luxury homes" },
      { property: "og:description", content: "Speak with Aria, our AI concierge, and find your next home." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const featured = properties.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Modern villa at golden hour with infinity pool"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/0 to-background/80" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-32">
            <div className="max-w-2xl animate-fade-up">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">
                Est. 1998 — Worldwide
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-foreground md:text-7xl">
                Homes that feel <em className="text-primary">like a beginning.</em>
              </h1>
              <p className="mt-6 max-w-xl text-base text-foreground/80 md:text-lg">
                Quietly curated properties in extraordinary places — from Dubai dunes to Tuscan
                hills. Speak with Aria, our voice concierge, anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative -mt-20 px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (location) params.set("loc", location);
              if (type) params.set("type", type);
              if (maxPrice) params.set("max", maxPrice);
              void navigate({ to: "/listings", search: Object.fromEntries(params) as never });
            }}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-3 rounded-2xl bg-background p-3 shadow-elegant md:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <Field label="Location">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dubai, Tuscany, New York…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <Field label="Property type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              >
                <option value="">Any</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Penthouse</option>
                <option>Townhouse</option>
                <option>Chalet</option>
              </select>
            </Field>
            <Field label="Max price">
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              >
                <option value="">Any</option>
                <option value="500000">$500K</option>
                <option value="1000000">$1M</option>
                <option value="2500000">$2.5M</option>
                <option value="5000000">$5M</option>
                <option value="10000000">$10M+</option>
              </select>
            </Field>
            <button
              type="submit"
              className="rounded-xl bg-primary px-6 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Featured</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">This week's favourites</h2>
          </div>
          <Link to="/listings" className="hidden text-sm text-primary underline-offset-4 hover:underline md:inline-block">
            View all listings →
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* AI CONCIERGE BANNER */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-warm p-12 md:p-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Voice concierge</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                Just ask Aria. <em>Out loud.</em>
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                "Show me a beachfront villa under five million." Aria listens, answers, and walks
                you through every property — like a thoughtful agent who never sleeps.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                <li>· Natural voice conversations in any browser</li>
                <li>· Remembers context across the whole chat</li>
                <li>· Books viewings and connects you to a human agent</li>
              </ul>
            </div>
            <div className="relative flex justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant">
                <span className="absolute inset-0 rounded-full bg-primary opacity-20 animate-pulse-ring" />
                <span className="absolute inset-4 rounded-full bg-primary opacity-30 animate-pulse-ring" style={{ animationDelay: "0.4s" }} />
                <svg className="relative h-20 w-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="9" y="3" width="6" height="12" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0" strokeLinecap="round" />
                  <path d="M12 18v3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Promise</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
          A home is not a transaction. It's a chapter — and we treat it that way.
        </h2>
        <Link
          to="/contact"
          className="mt-10 inline-block rounded-full bg-primary px-8 py-3 text-xs font-medium uppercase tracking-wider text-primary-foreground"
        >
          Speak with an agent
        </Link>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl bg-secondary/40 px-4 py-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
