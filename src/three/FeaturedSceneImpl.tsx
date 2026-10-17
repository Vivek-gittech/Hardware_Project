import { Float, PerspectiveCamera, View } from "@react-three/drei";
import { getProduct, getVariant } from "@/lib/products";
import { Fit, ProductModel } from "./models";
import { StudioLights } from "./Studio";

const LAYOUT: { id: string; pos: [number, number, number]; rot: [number, number, number]; size: number; finish?: "brushed-chrome" | "champagne-gold" | "matte-black" }[] = [
  { id: "precision-160", pos: [0.6, 0.5, 0], rot: [0.3, -0.4, -1.05], size: 3.4 },
  { id: "aurum-128", pos: [-1.9, -0.6, -0.6], rot: [0.2, 0.5, -1.35], size: 2.0 },
  { id: "noir-flute-192", pos: [2.2, -1.4, 0.3], rot: [0.5, -0.3, -0.45], size: 2.6 },
  { id: "orbit-knob", pos: [2.6, 1.9, -1], rot: [0, -0.4, 0], size: 0.8 },
];

/** Cinematic Monolith collection — four distinct products floating in one view. */
export default function FeaturedSceneImpl({ className }: { className?: string }) {
  return (
    <View className={className ?? ""}>
      <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={35} />
      <StudioLights />
      {LAYOUT.map((l, i) => {
        const p = getProduct(l.id)!;
        const v = getVariant(p);
        return (
          <Float key={l.id} speed={1 + i * 0.25} rotationIntensity={0.5} floatIntensity={0.8}>
            <group position={l.pos} rotation={l.rot}>
              <Fit size={l.size} deps={[p.id]}>
                <ProductModel type={p.modelType} config={{ ...p.modelConfig, ...v.config }} finish={l.finish ?? p.defaultFinish} />
              </Fit>
            </group>
          </Float>
        );
      })}
    </View>
  );
}
