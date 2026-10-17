import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { categoryLabel, getProduct, getVariant, PRODUCTS } from "@/lib/products";
import { FINISHES, type FinishId } from "@/three/finishes";
import type { ControlsHandle } from "@/three/DetailViewerImpl";
import { Loader3D, NoWebGL, Product3D, useWebGL } from "@/components/Product3D";
import { ProductCard, useInteraction } from "@/components/ProductCard";

const DetailViewerImpl = lazy(() => import("@/three/DetailViewerImpl"));

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { id: p.id, name: p.name, tagline: p.tagline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found — Artisan Hardware" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.name} — Artisan Hardware`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.tagline },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Product not found</h1>
      <Link to="/products" className="mt-6 inline-block text-primary">Back to products →</Link>
    </main>
  ),
  component: Detail,
});

function VariantTile({ productId, variantId, label, active, onSelect }: { productId: string; variantId: string; label: string; active: boolean; onSelect: () => void }) {
  const [interaction, handlers] = useInteraction();
  const p = getProduct(productId)!;
  return (
    <button onClick={onSelect} {...handlers} className={`card-showroom relative overflow-hidden text-left ${active ? "border-primary" : ""}`} aria-pressed={active}>
      <div className="relative aspect-square">
        <Product3D product={p} variantId={variantId} interaction={interaction} size={2.2} />
      </div>
      <p className="border-t border-border px-4 py-3 text-sm">{label}</p>
    </button>
  );
}

function Detail() {
  const { id } = Route.useLoaderData();
  const p = getProduct(id)!;
  const [variantId, setVariantId] = useState(p.defaultVariant);
  const [finish, setFinish] = useState<FinishId>(p.defaultFinish);
  useEffect(() => {
    setVariantId(p.defaultVariant);
    setFinish((f) => (p.finishes.includes(f) ? f : p.defaultFinish));
  }, [p]);
  const v = getVariant(p, variantId);
  const controls = useRef<ControlsHandle | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const webgl = useWebGL();
  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3);

  const zoom = (f: number) => {
    const c = controls.current;
    if (!c) return;
    c.object.position.multiplyScalar(f);
    c.update();
  };
  const btn = "rounded-full border border-border bg-background/70 px-4 py-2 text-xs tracking-widest backdrop-blur hover:border-primary";

  return (
    <main className="bg-showroom px-6 pb-24 pt-14">
      <div className="mx-auto max-w-7xl">
        <Link to="/products" search={{ category: p.category }} className="eyebrow hover:text-foreground">← {categoryLabel(p.category)}</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div ref={frame} className="card-showroom relative aspect-square overflow-hidden lg:aspect-[4/3.4]">
            {webgl === null ? <Loader3D /> : !webgl ? <NoWebGL label={p.name} /> : (
              <Suspense fallback={<Loader3D />}>
                <DetailViewerImpl product={p} variantId={v.id} finish={finish} controlsRef={controls} />
              </Suspense>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <button className={btn} onClick={() => zoom(0.82)}>ZOOM +</button>
              <button className={btn} onClick={() => zoom(1.2)}>ZOOM −</button>
              <button className={btn} onClick={() => controls.current?.reset()}>RESET</button>
              <button className={btn} onClick={() => (document.fullscreenElement ? document.exitFullscreen() : frame.current?.requestFullscreen())}>FULLSCREEN</button>
            </div>
            <p className="pointer-events-none absolute right-5 top-5 text-xs text-muted-foreground">Drag to rotate · scroll to zoom</p>
          </div>

          <div>
            <h1 className="font-display-italic text-4xl md:text-5xl">{p.name}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{p.tagline}</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">{p.description}</p>

            <p className="eyebrow mt-10">Finish — {FINISHES[finish].label}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {p.finishes.map((f) => (
                <button key={f} onClick={() => setFinish(f)} aria-label={FINISHES[f].label} aria-pressed={f === finish}
                  className={`h-11 w-11 rounded-full border-2 transition-transform hover:scale-110 ${f === finish ? "border-foreground" : "border-transparent"}`}
                  style={{ background: FINISHES[f].swatch }} />
              ))}
            </div>

            <p className="eyebrow mt-10">Size</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.variants.map((x) => (
                <button key={x.id} onClick={() => setVariantId(x.id)} aria-pressed={x.id === v.id}
                  className={`rounded-full border px-5 py-2 text-sm ${x.id === v.id ? "border-foreground bg-foreground text-background" : "border-border hover:border-primary"}`}>
                  {x.label}
                </button>
              ))}
            </div>

            <dl className="mt-10 divide-y divide-border border-y border-border">
              {[...Object.entries(v.specs), ["Material", p.material], ["Finish", FINISHES[finish].label]].map(([k, val]) => (
                <div key={k} className="flex justify-between py-3 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
            <Link to="/contact" className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 text-sm tracking-widest text-background">ENQUIRE</Link>
          </div>
        </div>

        <h2 className="mt-24 font-display text-3xl">THE SIZE FAMILY</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-5">
          {p.variants.map((x) => (
            <VariantTile key={x.id} productId={p.id} variantId={x.id} label={x.label} active={x.id === v.id} onSelect={() => setVariantId(x.id)} />
          ))}
        </div>

        <h2 className="mt-24 font-display text-3xl">YOU MAY ALSO LIKE</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => <ProductCard key={r.id} product={r} index={PRODUCTS.indexOf(r)} />)}
        </div>
      </div>
    </main>
  );
}
