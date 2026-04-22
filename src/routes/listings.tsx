import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/PropertyCard";

type Search = { loc?: string; type?: string; max?: string };

export const Route = createFileRoute("/listings")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    loc: typeof search.loc === "string" ? search.loc : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    max: typeof search.max === "string" ? search.max : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Listings — Maison Estates" },
      {
        name: "description",
        content: "Browse our full collection of curated luxury properties across the world.",
      },
      { property: "og:title", content: "Listings — Maison Estates" },
      { property: "og:description", content: "Browse our curated luxury properties." },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  const search = useSearch({ from: "/listings" });
  const [loc, setLoc] = useState(search.loc ?? "");
  const [type, setType] = useState(search.type ?? "");
  const [max, setMax] = useState(search.max ?? "");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (loc && !p.location.toLowerCase().includes(loc.toLowerCase())) return false;
      if (type && p.type !== type) return false;
      if (max && p.price > Number(max)) return false;
      return true;
    });
  }, [loc, type, max]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The Collection</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">All properties</h1>
        <p className="mt-4 text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "home" : "homes"} from our curated portfolio.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-10 grid gap-3 rounded-2xl bg-secondary/40 p-3 md:grid-cols-3">
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Filter by location"
          className="rounded-xl bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl bg-background px-4 py-3 text-sm outline-none"
        >
          <option value="">All types</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Penthouse</option>
          <option>Townhouse</option>
          <option>Chalet</option>
        </select>
        <select
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="rounded-xl bg-background px-4 py-3 text-sm outline-none"
        >
          <option value="">Any price</option>
          <option value="500000">Under $500K</option>
          <option value="1000000">Under $1M</option>
          <option value="2500000">Under $2.5M</option>
          <option value="5000000">Under $5M</option>
          <option value="10000000">Under $10M</option>
        </select>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 rounded-2xl bg-secondary/40 p-16 text-center">
          <h3 className="font-serif text-3xl">Nothing matches — yet.</h3>
          <p className="mt-2 text-muted-foreground">
            Try widening your search, or ask Aria to find something close.
          </p>
        </div>
      )}
    </div>
  );
}
