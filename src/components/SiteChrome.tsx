import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-ivory px-4 py-3 text-cream-foreground shadow-lg sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-lg font-semibold text-gold">A</span>
          <span className="text-lg font-semibold">
            Artisan <span className="text-gold">Hardware</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-6 py-2.5 transition-colors hover:bg-cream"
              activeProps={{ className: "bg-espresso text-ivory hover:bg-espresso" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="rounded-full px-4 py-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="mx-auto mt-2 flex max-w-7xl flex-col rounded-3xl bg-ivory p-3 text-cream-foreground md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-full px-5 py-3" activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "bg-espresso text-ivory" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">ARTISAN HARDWARE</p>
          <p className="mt-3 max-w-sm text-muted-foreground">Architectural furniture fittings — handles, knobs, hinges and channels engineered to one standard of finish.</p>
        </div>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p className="eyebrow mb-2">Explore</p>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-foreground">{n.label}</Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p className="eyebrow mb-2">Follow</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Instagram</a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Pinterest</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Artisan Hardware</p>
    </footer>
  );
}
