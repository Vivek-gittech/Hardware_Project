import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject, type ReactNode } from "react";
import type * as THREE from "three";

export interface Interaction {
  x: number;
  y: number;
  hover: boolean;
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#e9e4ff", "#1a140c", 0.6]} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <directionalLight position={[-5, 1.5, -2]} intensity={1.8} color="#7b74ff" />
      <directionalLight position={[2, -3, 3]} intensity={0.7} color="#ffd6a0" />
    </>
  );
}

/** Idle float/oscillation + pointer tilt + hover scale. */
export function Motion({
  children,
  interaction,
  spin = "sway",
  baseRotation = [0, 0, 0],
}: {
  children: ReactNode;
  interaction?: MutableRefObject<Interaction> | undefined;
  spin?: "sway" | "full" | "none";
  baseRotation?: [number, number, number];
}) {
  const g = useRef<THREE.Group>(null);
  const still = useRef(reduced());
  useFrame(({ clock }, raw) => {
    const o = g.current;
    if (!o) return;
    const dt = Math.min(raw, 0.05);
    const t = clock.elapsedTime;
    const it = interaction?.current;
    const k = 1 - Math.exp(-6 * dt);
    const motion = still.current ? 0 : 1;
    const targetY = (spin === "sway" ? Math.sin(t * 0.45) * 0.45 * motion : 0) + (it ? it.x * 0.6 : 0);
    const targetX = it ? -it.y * 0.35 : 0;
    if (spin === "full") o.rotation.y += dt * 0.35 * motion;
    else o.rotation.y += (targetY - o.rotation.y) * k;
    o.rotation.x += (targetX - o.rotation.x) * k;
    o.position.y = Math.sin(t * 0.9) * 0.06 * motion;
    const s = it?.hover ? 1.07 : 1;
    o.scale.setScalar(o.scale.x + (s - o.scale.x) * k);
  });
  return (
    <group ref={g}>
      <group rotation={baseRotation}>{children}</group>
    </group>
  );
}
