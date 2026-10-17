import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import hero from "@/assets/hero-kitchen.jpg";
import founder from "@/assets/founder.jpg";
import { CATEGORIES, getProduct, PRODUCTS } from "@/lib/products";
import { FINISH_LIST, FINISHES, type FinishId } from "@/three/finishes";
import { Featured3D, Product3D } from "@/components/Product3D";
import { ProductCard, useInteraction } from "@/components/ProductCard";
import {Hero} from '../selection/Hero'

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artisan Hardware — Premium Furniture Hardware in 3D" },
      { name: "description", content: "Handles, knobs, hinges and drawer channels — explore every piece in interactive 3D." },
      { property: "og:title", content: "Artisan Hardware — Premium Furniture Hardware" },
      { property: "og:description", content: "Explore premium furniture hardware in interactive 3D." },
    ],
  }),
  component: Home,
});

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

function CategoryTile({ id, label, models, heroId, i }: { id: (typeof CATEGORIES)[number]["id"]; label: string; models: number; heroId: string; i: number }) {
  const [interaction, handlers] = useInteraction();
  return (
    <Link to="/products" search={{ category: id }} {...handlers} className="group relative block border border-border bg-card/40 transition-colors hover:bg-card">
      <div className="relative aspect-square">
        <Product3D product={getProduct(heroId)!} interaction={interaction} size={2.3} />
      </div>
      <div className="p-6">
        <p className="text-xs tracking-[0.3em] text-muted-foreground">{String(i + 1).padStart(2, "0")} · {models} MODELS</p>
        <p className="mt-2 font-display-italic text-xl">{label}</p>
      </div>
    </Link>
  );
}

function FinishSelector() {
  const [finish, setFinish] = useState<FinishId>("brushed-chrome");
  const [pid, setPid] = useState("precision-160");
  const p = getProduct(pid)!;
  const avail = p.finishes.includes(finish);
  return (
    <div className="card-showroom mx-auto mt-14 grid max-w-6xl overflow-hidden md:grid-cols-[1.5fr_1fr]">
      <div className="relative aspect-square md:aspect-auto md:min-h-[520px]">
        <Product3D product={p} finish={finish} size={2.8} />
      </div>
      <div className="border-t border-border p-8 md:border-l md:border-t-0">
        <p className="eyebrow">Product</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRODUCTS.map((x) => (
            <button key={x.id} onClick={() => setPid(x.id)} className={`rounded-full border px-3 py-1.5 text-xs ${x.id === pid ? "border-foreground" : "border-border text-muted-foreground"}`}>
              {x.name}
            </button>
          ))}
        </div>
        <p className="eyebrow mt-8">Finish</p>
        <div className="mt-3 flex flex-col gap-2">
          {FINISH_LIST.map((f) => {
            const ok = p.finishes.includes(f.id);
            return (
              <button key={f.id} disabled={!ok} onClick={() => setFinish(f.id)}
                className={`flex items-center gap-4 rounded-full border px-4 py-3 text-left transition-colors disabled:opacity-35 ${f.id === finish ? "border-foreground" : "border-transparent hover:border-border"}`}>
                <span className="h-8 w-8 rounded-full" style={{ background: f.swatch }} />
                {f.label}
              </button>
            );
          })}
        </div>
        {!avail && <p className="mt-4 text-xs text-muted-foreground">{FINISHES[finish].label} isn't offered for {p.name} — showing {FINISHES[p.defaultFinish].label}.</p>}
      </div>
    </div>
  );
}

function Home() {
  return (
    <main>
      <Hero/>
      {/* <section className="bg-cream px-4 pb-10 pt-6 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem]">
          <img src={hero} alt="Warm oak kitchen with black stone island" width={1920} height={1088} className="h-[78vh] min-h-[520px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/40 to-transparent" />
          <motion.div {...reveal} className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
            <span className="w-fit rounded-full border border-ivory/30 bg-espresso/40 px-5 py-2 text-xs font-semibold tracking-[0.15em] text-ivory">PREMIUM FURNITURE HARDWARE</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-ivory md:text-7xl">
              Premium Hardware for <span className="text-gold">Beautiful Spaces</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ivory/90">Discover beautifully engineered furniture fittings for modern living — crafted with precision, designed to last.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-gold px-8 py-4 font-semibold text-primary-foreground">Explore Products →</Link>
              <Link to="/contact" className="rounded-full border border-ivory/40 bg-espresso/30 px-8 py-4 font-semibold text-ivory">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section> */}

      <section className="bg-showroom relative overflow-hidden">
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-6 px-6 py-24 lg:grid-cols-2">
          <motion.div {...reveal}>
            <p className="eyebrow">Featured collection · Monolith</p>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] text-glow md:text-7xl">ENGINEERED FOR BEAUTIFUL SPACES</h2>
            <p className="mt-8 max-w-md text-muted-foreground">An architectural family of handles, knobs and pulls sharing one profile, one tolerance and one finish — so a whole kitchen reads as a single object.</p>
            <Link to="/products" search={{ category: "handles" }} className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-sm tracking-[0.2em] text-background">EXPLORE MONOLITH</Link>
          </motion.div>
          <div className="relative h-[520px] lg:h-[640px]"><Featured3D /></div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.h2 {...reveal} className="font-display text-4xl md:text-6xl">THE COLLECTION</motion.h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <motion.h2 {...reveal} className="font-display-italic text-5xl text-glow md:text-7xl">Every moving part</motion.h2>
        <p className="mt-4 text-muted-foreground">From the handle in your palm to the channel you never see — one standard of finish.</p>
        <div className="mx-auto mt-14 grid max-w-7xl grid-cols-2 text-left md:grid-cols-5">
          {CATEGORIES.map((c, i) => <CategoryTile key={c.id} id={c.id} label={c.label} models={c.models} heroId={c.hero} i={i} />)}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <motion.h2 {...reveal} className="font-display-italic text-5xl text-glow md:text-7xl">Choose your finish</motion.h2>
        <p className="mt-4 text-muted-foreground">Every finish is PVD-coated, salt-spray tested to 480 hours and inspected by hand.</p>
        <FinishSelector />
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <motion.img {...reveal} src={founder} alt="Founder holding a brass handle in the workshop" loading="lazy" width={1024} height={1280} className="rounded-[2rem] object-cover" />
          <motion.div {...reveal}>
            <p className="eyebrow">Meet the founder</p>
            <h2 className="mt-4 font-display text-4xl">MADE BY HAND, MEASURED TO THE MICRON</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">Artisan Hardware began in a small brass workshop with a simple belief: the parts you touch every day deserve the same care as the furniture they live on.</p>
            <Link to="/about" className="mt-8 inline-block text-primary">Our story →</Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
