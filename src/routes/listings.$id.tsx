import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { properties, formatPrice } from "@/data/properties";

export const Route = createFileRoute("/listings/$id")({
  loader: ({ params }) => {
    const property = properties.find((p) => p.id === params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.property.title} — Maison Estates` },
          { name: "description", content: loaderData.property.description },
          { property: "og:title", content: loaderData.property.title },
          { property: "og:description", content: loaderData.property.description },
          { property: "og:image", content: loaderData.property.image },
          { name: "twitter:image", content: loaderData.property.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-serif text-5xl">Property not found</h1>
      <Link to="/listings" className="mt-6 inline-block text-primary underline-offset-4 hover:underline">
        Back to listings →
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();

  return (
    <div>
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">{property.type}</p>
          <h1 className="mt-3 font-serif text-5xl text-foreground md:text-7xl">{property.title}</h1>
          <p className="mt-2 text-lg text-foreground/80">{property.location}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="grid grid-cols-3 gap-6 border-b border-border/60 pb-8">
            <Stat label="Bedrooms" value={`${property.beds}`} />
            <Stat label="Bathrooms" value={`${property.baths}`} />
            <Stat label="Area" value={`${property.area.toLocaleString()} sqft`} />
          </div>

          <h2 className="mt-12 font-serif text-3xl">About this home</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{property.description}</p>

          <h2 className="mt-12 font-serif text-3xl">Features</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {property.features.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-xl bg-secondary/40 px-4 py-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl bg-secondary/40 p-8 md:sticky md:top-28">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Asking price</p>
          <div className="mt-2 font-serif text-5xl text-primary">{formatPrice(property.price)}</div>
          <Link
            to="/contact"
            className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
          >
            Schedule a viewing
          </Link>
          <button
            type="button"
            className="mt-3 w-full rounded-full border border-border bg-background px-6 py-3 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-muted"
          >
            Save property
          </button>
          <p className="mt-6 text-xs text-muted-foreground">
            Or tap the microphone in the corner — Aria can answer any question about this home.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl">{value}</div>
    </div>
  );
}
