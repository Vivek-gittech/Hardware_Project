import type { FinishId } from "@/three/finishes";

export type ModelType = "handle" | "knob" | "hinge" | "channel";
export type ModelConfig = Record<string, number | string>;

export interface Variant {
  id: string;
  label: string;
  config: ModelConfig;
  specs: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  modelType: ModelType;
  modelConfig: ModelConfig;
  defaultFinish: FinishId;
  finishes: FinishId[];
  defaultVariant: string;
  variants: Variant[];
  tagline: string;
  description: string;
  material: string;
  /** Orientation used in cards and showcases (radians). */
  displayRotation: [number, number, number];
}

export type CategoryId = "handles" | "fluted" | "knobs" | "hinges" | "channels";

export const CATEGORIES: { id: CategoryId; label: string; blurb: string; models: number; hero: string }[] = [
  { id: "handles", label: "Handles", blurb: "Straight pulls and bar handles", models: 48, hero: "precision-160" },
  { id: "fluted", label: "Fluted Handles", blurb: "Reeded profiles for statement joinery", models: 14, hero: "noir-flute-192" },
  { id: "knobs", label: "Cabinet Knobs", blurb: "Turned and solid knobs", models: 26, hero: "orbit-knob" },
  { id: "hinges", label: "Hinges", blurb: "Butt and cabinet hinges", models: 18, hero: "pivot-hinge" },
  { id: "channels", label: "Drawer Channels", blurb: "Telescopic ball-bearing slides", models: 12, hero: "glide-channel" },
];

const handleVariant = (prefix: string, centres: number, weight: number, extra: ModelConfig = {}): Variant => ({
  id: `${prefix}-${centres}`,
  label: `${centres} mm`,
  config: { centres, ...extra },
  specs: {
    "Hole centres": `${centres} mm`,
    "Overall length": `${centres + 2 * Number(extra["overhang"] ?? 24)} mm`,
    Weight: `${weight} g`,
  },
});

/** Sample catalogue data — dimensions are illustrative, not manufacturer-verified. */
export const PRODUCTS: Product[] = [
  {
    id: "precision-160",
    name: "PRECISION 160",
    category: "handles",
    modelType: "handle",
    modelConfig: { profile: "rectangular", centres: 160, overhang: 24, thickness: 12, depth: 7, projection: 30, postDiameter: 9, edgeRadius: 1.5 },
    defaultFinish: "brushed-chrome",
    finishes: ["brushed-chrome", "champagne-gold", "matte-black", "brushed-brass", "satin-nickel"],
    defaultVariant: "precision-160",
    variants: [
      handleVariant("precision", 96, 68),
      handleVariant("precision", 128, 82),
      handleVariant("precision", 160, 96),
      handleVariant("precision", 192, 112),
    ],
    tagline: "A flat architectural bar with knife-sharp chamfers.",
    description:
      "Precision is machined from a single bar of solid brass, with a flat face that catches light along its full length. Two turned posts sit on slim rosettes for a clean, floating line.",
    material: "Solid brass, PVD coated",
    displayRotation: [0.2, -0.5, -1.1],
  },
  {
    id: "aurum-128",
    name: "AURUM 128",
    category: "handles",
    modelType: "handle",
    modelConfig: { profile: "round", centres: 128, overhang: 18, thickness: 10, depth: 10, projection: 32, postDiameter: 8, edgeRadius: 5 },
    defaultFinish: "champagne-gold",
    finishes: ["champagne-gold", "brushed-brass", "brushed-chrome", "satin-nickel"],
    defaultVariant: "aurum-128",
    variants: [
      handleVariant("aurum", 96, 54, { overhang: 18 }),
      handleVariant("aurum", 128, 66, { overhang: 18 }),
      handleVariant("aurum", 160, 79, { overhang: 18 }),
    ],
    tagline: "A soft round bar with domed ends.",
    description:
      "Aurum pairs a slender round bar with fully radiused ends — warm in the hand and quiet on the door. Finished in our signature champagne gold.",
    material: "Solid brass, PVD coated",
    displayRotation: [0.25, 0.4, -1.2],
  },
  {
    id: "noir-flute-192",
    name: "NOIR FLUTE 192",
    category: "fluted",
    modelType: "handle",
    modelConfig: { profile: "fluted", centres: 192, overhang: 22, thickness: 14, depth: 14, projection: 34, postDiameter: 9, flutes: 10 },
    defaultFinish: "matte-black",
    finishes: ["matte-black", "brushed-brass", "champagne-gold", "brushed-chrome"],
    defaultVariant: "noir-flute-192",
    variants: [
      handleVariant("noir-flute", 128, 92, { overhang: 22 }),
      handleVariant("noir-flute", 192, 128, { overhang: 22 }),
      handleVariant("noir-flute", 256, 164, { overhang: 22 }),
    ],
    tagline: "Ten reeded grooves along a solid round bar.",
    description:
      "Noir Flute is cut with ten longitudinal grooves that turn every highlight into a line. The matte-black finish keeps it graphic; brass makes it glow.",
    material: "Solid brass, ceramic matte coating",
    displayRotation: [0.3, -0.3, -1.2],
  },
  {
    id: "orbit-knob",
    name: "ORBIT KNOB",
    category: "knobs",
    modelType: "knob",
    modelConfig: { style: "sphere", diameter: 32, projection: 34, baseDiameter: 20 },
    defaultFinish: "champagne-gold",
    finishes: ["champagne-gold", "brushed-chrome", "matte-black", "brushed-brass", "satin-nickel"],
    defaultVariant: "orbit-32",
    variants: [
      { id: "orbit-25", label: "Ø 25 mm", config: { diameter: 25, projection: 28, baseDiameter: 16 }, specs: { Diameter: "25 mm", Projection: "28 mm", Weight: "38 g" } },
      { id: "orbit-32", label: "Ø 32 mm", config: { diameter: 32, projection: 34, baseDiameter: 20 }, specs: { Diameter: "32 mm", Projection: "34 mm", Weight: "61 g" } },
      { id: "orbit-38", label: "Ø 38 mm", config: { diameter: 38, projection: 40, baseDiameter: 24 }, specs: { Diameter: "38 mm", Projection: "40 mm", Weight: "88 g" } },
    ],
    tagline: "A turned sphere on a slender stem.",
    description:
      "Orbit is turned from solid brass into a perfect sphere, lifted off the door on a waisted stem and a flat rosette.",
    material: "Solid brass, PVD coated",
    displayRotation: [0.15, -0.7, 0],
  },
  {
    id: "pivot-hinge",
    name: "PIVOT HINGE",
    category: "hinges",
    modelType: "hinge",
    modelConfig: { height: 100, leafWidth: 32, thickness: 2.5, knuckles: 5, openAngle: 150 },
    defaultFinish: "satin-nickel",
    finishes: ["satin-nickel", "brushed-brass", "matte-black", "brushed-chrome"],
    defaultVariant: "pivot-100",
    variants: [
      { id: "pivot-75", label: "75 mm", config: { height: 75, leafWidth: 26, knuckles: 3 }, specs: { "Leaf height": "75 mm", "Open width": "52 mm", Knuckles: "3", "Load rating": "20 kg / pair" } },
      { id: "pivot-100", label: "100 mm", config: { height: 100, leafWidth: 32, knuckles: 5 }, specs: { "Leaf height": "100 mm", "Open width": "64 mm", Knuckles: "5", "Load rating": "40 kg / pair" } },
      { id: "pivot-125", label: "125 mm", config: { height: 125, leafWidth: 38, knuckles: 5 }, specs: { "Leaf height": "125 mm", "Open width": "76 mm", Knuckles: "5", "Load rating": "60 kg / pair" } },
    ],
    tagline: "A five-knuckle butt hinge with a removable pin.",
    description:
      "Pivot is a heavy-gauge butt hinge with countersunk screw holes and a removable steel pin, sized for wardrobes and full-height doors.",
    material: "Stainless steel, PVD coated",
    displayRotation: [0.25, -0.6, 0],
  },
  {
    id: "glide-channel",
    name: "GLIDE CHANNEL",
    category: "channels",
    modelType: "channel",
    modelConfig: { length: 450, height: 45, width: 12.7 },
    defaultFinish: "satin-nickel",
    finishes: ["satin-nickel", "matte-black", "brushed-chrome"],
    defaultVariant: "glide-450",
    variants: [300, 350, 400, 450, 500].map((l) => ({
      id: `glide-${l}`,
      label: `${l} mm`,
      config: { length: l },
      specs: { "Closed length": `${l} mm`, Extension: "Full, 3-section", "Load rating": `${l >= 400 ? 45 : 35} kg / pair`, Height: "45 mm" },
    })),
    tagline: "A full-extension, three-section ball-bearing slide.",
    description:
      "Glide is a telescopic drawer channel with steel ball-bearing races, a soft disconnect lever and a rear mounting bracket.",
    material: "Cold-rolled steel, plated",
    displayRotation: [0.35, -0.55, 0.05],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getVariant = (p: Product, id?: string) =>
  p.variants.find((v) => v.id === id) ?? p.variants.find((v) => v.id === p.defaultVariant) ?? p.variants[0]!;
export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
