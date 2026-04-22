import { Link } from "@tanstack/react-router";

export function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Listings" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-tight">Maison</span>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Estates</span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="text-sm transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="hidden rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 md:inline-block"
        >
          Book a viewing
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="font-serif text-2xl">Maison Estates</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Curated luxury homes across the world's most sought-after destinations.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="mb-3 text-xs uppercase tracking-wider text-foreground">Office</div>
          <p>Boulevard Haussmann 142</p>
          <p>75008 Paris, France</p>
          <p className="mt-2">+33 1 84 88 19 00</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="mb-3 text-xs uppercase tracking-wider text-foreground">Hours</div>
          <p>Mon — Fri · 9:00 — 19:00</p>
          <p>Sat · 10:00 — 17:00</p>
          <p className="mt-2">concierge@maisonestates.com</p>
        </div>
      </div>
      <div className="border-t border-border/60 px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Maison Estates. Crafted with care.
      </div>
    </footer>
  );
}
