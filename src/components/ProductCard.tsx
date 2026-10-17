import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, type PointerEvent } from "react";
import type { Product } from "@/lib/products";
import { FINISHES } from "@/three/finishes";
import type { Interaction } from "@/three/Studio";
import { Product3D } from "./Product3D";

export function useInteraction() {
  const ref = useRef<Interaction>({ x: 0, y: 0, hover: false });
  const handlers = {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      ref.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ref.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      ref.current.hover = true;
    },
    onPointerLeave: () => {
      ref.current.x = 0;
      ref.current.y = 0;
      ref.current.hover = false;
    },
  };
  return [ref, handlers] as const;
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const [interaction, handlers] = useInteraction();
  const sizes = product.variants.map((v) => v.label.replace(/\s?mm/, "").replace("Ø ", "")).join(" / ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/products/$id" params={{ id: product.id }} className="card-showroom group block overflow-hidden" {...handlers}>
        <div className="relative aspect-[4/3.7]">
          <Product3D product={product} interaction={interaction} />
        </div>
        <div className="border-t border-border p-7">
          <p className="text-xs tracking-[0.3em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 font-display-italic text-2xl text-foreground">{product.name}</h3>
          <p className="mt-2 text-muted-foreground">{FINISHES[product.defaultFinish].label}</p>
          <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground">{sizes} MM</p>
          <p className="mt-6 text-foreground transition-transform duration-300 group-hover:translate-x-1">View Product →</p>
        </div>
      </Link>
    </motion.div>
  );
}
