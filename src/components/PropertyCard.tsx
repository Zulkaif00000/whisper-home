import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/data/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to="/listings/$id"
      params={{ id: property.id }}
      className="group block overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.image}
          alt={property.title}
          width={1024}
          height={768}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs uppercase tracking-wider text-foreground backdrop-blur">
          {property.type}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-2xl leading-tight">{property.title}</h3>
          <div className="font-serif text-xl text-primary">{formatPrice(property.price)}</div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{property.location}</p>
        <div className="mt-5 flex items-center gap-5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span>{property.beds} beds</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{property.baths} baths</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{property.area.toLocaleString()} sqft</span>
        </div>
      </div>
    </Link>
  );
}
