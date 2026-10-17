import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): { category?: CategoryId } =>
    CATEGORIES.some((c) => c.id === s["category"]) ? { category: s["category"] as CategoryId } : {},
  head: () => ({
    meta: [
      { title: "Products — Artisan Hardware" },
      { name: "description", content: "Explore handles, fluted handles, knobs, hinges and drawer channels in interactive 3D." },
      { property: "og:title", content: "Products — Artisan Hardware" },
      { property: "og:description", content: "Explore every Artisan Hardware product in interactive 3D." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const list = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  const chip = "rounded-full border border-border px-5 py-2 text-sm transition-colors hover:border-primary";
  const active = "bg-foreground text-background border-foreground";
  return (
    <main className="bg-showroom min-h-screen px-6 pb-24 pt-20">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">The catalogue</p>
        <h1 className="mt-4 font-display text-5xl text-glow md:text-7xl">EVERY PIECE, IN 3D</h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/products" search={{}} className={`${chip} ${!category ? active : ""}`}>All</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/products" search={{ category: c.id }} className={`${chip} ${category === c.id ? active : ""}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={PRODUCTS.indexOf(p) + (i - i)} />
          ))}
        </div>
      </div>
    </main>
  );
}
