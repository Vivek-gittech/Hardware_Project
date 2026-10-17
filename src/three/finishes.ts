/** Browser-safe finish metadata (no three.js import) for UI swatches. */
export type FinishId = "brushed-chrome" | "champagne-gold" | "matte-black" | "brushed-brass" | "satin-nickel";

export interface FinishDef {
  id: FinishId;
  label: string;
  /** CSS gradient for the UI swatch only — the 3D material is configured separately. */
  swatch: string;
  color: string;
  metalness: number;
  roughness: number;
  brushed: boolean;
  clearcoat: number;
  clearcoatRoughness: number;
  anisotropy: number;
  envIntensity: number;
}

export const FINISHES: Record<FinishId, FinishDef> = {
  "brushed-chrome": { id: "brushed-chrome", label: "Brushed Chrome", swatch: "radial-gradient(circle at 30% 30%, #fff, #a9adb5 60%, #5b5f66)", color: "#dfe3ea", metalness: 1, roughness: 0.16, brushed: true, clearcoat: 0.2, clearcoatRoughness: 0.1, anisotropy: 0.7, envIntensity: 1.2 },
  "champagne-gold": { id: "champagne-gold", label: "Champagne Gold", swatch: "radial-gradient(circle at 30% 30%, #fbecd0, #cfae7c 60%, #7d6440)", color: "#e6c896", metalness: 1, roughness: 0.18, brushed: false, clearcoat: 0.4, clearcoatRoughness: 0.15, anisotropy: 0, envIntensity: 1.1 },
  "matte-black": { id: "matte-black", label: "Matte Black", swatch: "radial-gradient(circle at 30% 30%, #6a6a70, #232327 60%, #0c0c0e)", color: "#26262b", metalness: 0.55, roughness: 0.42, brushed: false, clearcoat: 0.35, clearcoatRoughness: 0.35, anisotropy: 0, envIntensity: 1.4 },
  "brushed-brass": { id: "brushed-brass", label: "Brushed Brass", swatch: "radial-gradient(circle at 30% 30%, #f3dc9c, #b8923e 60%, #6b5320)", color: "#cfa54c", metalness: 1, roughness: 0.3, brushed: true, clearcoat: 0, clearcoatRoughness: 0.3, anisotropy: 0.6, envIntensity: 1 },
  "satin-nickel": { id: "satin-nickel", label: "Satin Nickel", swatch: "radial-gradient(circle at 30% 30%, #f0eee6, #aeaba1 60%, #66645d)", color: "#c4c1b7", metalness: 1, roughness: 0.34, brushed: true, clearcoat: 0, clearcoatRoughness: 0.4, anisotropy: 0.35, envIntensity: 1 },
};

export const FINISH_LIST = Object.values(FINISHES);
