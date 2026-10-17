import * as THREE from "three";
import { FINISHES, type FinishId } from "./finishes";

export type MaterialScope = "shared" | "detail";

let brushedTex: THREE.CanvasTexture | null = null;
function getBrushedTexture() {
  if (brushedTex) return brushedTex;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 2600; i++) {
    const g = 90 + Math.random() * 90;
    ctx.strokeStyle = `rgba(${g},${g},${g},0.5)`;
    ctx.lineWidth = Math.random() < 0.8 ? 1 : 2;
    const y = Math.random() * c.height;
    const x = Math.random() * c.width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 40 + Math.random() * 220, y);
    ctx.stroke();
  }
  brushedTex = new THREE.CanvasTexture(c);
  brushedTex.wrapS = brushedTex.wrapT = THREE.RepeatWrapping;
  brushedTex.repeat.set(2, 3);
  brushedTex.colorSpace = THREE.NoColorSpace;
  return brushedTex;
}

const cache = new Map<string, THREE.MeshPhysicalMaterial>();
let sharedEnv: THREE.Texture | null = null;

/** One cached physical material per finish & renderer scope — reused by every mesh. */
export function getMaterial(finish: FinishId, scope: MaterialScope = "shared") {
  const key = `${scope}:${finish}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const f = FINISHES[finish];
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(f.color),
    metalness: f.metalness,
    // the brushed map averages ~0.5, so double the base to keep target roughness
    roughness: f.brushed ? Math.min(1, f.roughness * 2) : f.roughness,
    clearcoat: f.clearcoat,
    clearcoatRoughness: f.clearcoatRoughness,
    envMapIntensity: f.envIntensity,
  });
  if (f.brushed) {
    m.roughnessMap = getBrushedTexture();
    m.anisotropy = f.anisotropy;
  }
  if (scope === "shared" && sharedEnv) m.envMap = sharedEnv;
  cache.set(key, m);
  return m;
}

export function setSharedEnv(tex: THREE.Texture) {
  sharedEnv = tex;
  cache.forEach((m, k) => {
    if (k.startsWith("shared:")) {
      m.envMap = tex;
      m.needsUpdate = true;
    }
  });
}

const accents = new Map<string, THREE.Material>();
/** Non-finish parts: dark plastic levers, screw-hole shadows. */
export function getAccent(kind: "plastic" | "hole") {
  const hit = accents.get(kind);
  if (hit) return hit;
  const m =
    kind === "plastic"
      ? new THREE.MeshStandardMaterial({ color: "#151517", roughness: 0.6, metalness: 0 })
      : new THREE.MeshBasicMaterial({ color: "#050506" });
  accents.set(kind, m);
  return m;
}
