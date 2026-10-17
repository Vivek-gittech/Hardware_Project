import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import type { ProductViewProps } from "@/three/ProductViewImpl";

const ProductViewImpl = lazy(() => import("@/three/ProductViewImpl"));
const FeaturedSceneImpl = lazy(() => import("@/three/FeaturedSceneImpl"));

let webgl: boolean | null = null;
export function hasWebGL() {
  if (webgl !== null) return webgl;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl;
}

export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(hasWebGL()), []);
  return ok;
}

export function Loader3D() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading 3D model">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}

export function NoWebGL({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
      <span className="font-display-italic text-lg text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">3D preview needs WebGL, which this browser has turned off.</span>
    </div>
  );
}

function Gate({ label, children }: { label: string; children: ReactNode }) {
  const ok = useWebGL();
  if (ok === null) return <Loader3D />;
  if (!ok) return <NoWebGL label={label} />;
  return <Suspense fallback={<Loader3D />}>{children}</Suspense>;
}

/** Product-specific 3D rendered through the shared page renderer. */
export function Product3D(props: ProductViewProps) {
  return (
    <Gate label={props.product.name}>
      <ProductViewImpl {...props} className={props.className ?? "absolute inset-0"} />
    </Gate>
  );
}

export function Featured3D({ className }: { className?: string }) {
  return (
    <Gate label="Monolith Collection">
      <FeaturedSceneImpl className={className ?? "absolute inset-0"} />
    </Gate>
  );
}

const SharedCanvas = lazy(() => import("@/three/SharedCanvas"));
export function SharedCanvasMount() {
  const ok = useWebGL();
  if (!ok) return null;
  return (
    <Suspense fallback={null}>
      <SharedCanvas />
    </Suspense>
  );
}
