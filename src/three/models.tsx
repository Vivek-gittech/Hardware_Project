import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ModelConfig, ModelType } from "@/lib/products";
import type { FinishId } from "./finishes";
import { getAccent, getMaterial, type MaterialScope } from "./materials";

/** World scale: 1 three.js unit = 100 mm. All configs are authored in millimetres. */
const S = 0.01;
const num = (c: ModelConfig, k: string, d: number) => (typeof c[k] === "number" ? (c[k] as number) : d);
const str = (c: ModelConfig, k: string, d: string) => (typeof c[k] === "string" ? (c[k] as string) : d);

const geoCache = new Map<string, THREE.BufferGeometry>();
function memoGeo(key: string, make: () => THREE.BufferGeometry) {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    geoCache.set(key, g);
  }
  return g;
}

export interface ModelProps {
  config: ModelConfig;
  finish: FinishId;
  scope?: MaterialScope;
  animate?: boolean;
}

/* ---------------- Handles (rectangular / round / fluted) ---------------- */

function flutedGeometry(L: number, R: number, flutes: number) {
  return memoGeo(`flute:${L}:${R}:${flutes}`, () => {
    const shape = new THREE.Shape();
    const N = flutes * 16;
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2;
      const groove = Math.pow(0.5 + 0.5 * Math.cos(flutes * th), 6);
      const r = R * (1 - 0.13 * groove);
      const x = Math.cos(th) * r;
      const y = Math.sin(th) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: L - R * 0.4,
      bevelEnabled: true,
      bevelThickness: R * 0.2,
      bevelSize: R * 0.12,
      bevelSegments: 3,
      curveSegments: 4,
    });
    g.rotateY(-Math.PI / 2);
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    g.translate(-(bb.min.x + bb.max.x) / 2, 0, 0);
    return g;
  });
}

export function HandleModel({ config, finish, scope = "shared" }: ModelProps) {
  const centres = num(config, "centres", 160) * S;
  const overhang = num(config, "overhang", 24) * S;
  const L = centres + overhang * 2;
  const t = num(config, "thickness", 12) * S;
  const depth = num(config, "depth", 8) * S;
  const proj = num(config, "projection", 30) * S;
  const postR = (num(config, "postDiameter", 8) * S) / 2;
  const profile = str(config, "profile", "rectangular");
  const edge = num(config, "edgeRadius", 1.5) * S;
  const mat = getMaterial(finish, scope);
  const barZ = proj - depth / 2;
  const postLen = proj - depth * 0.6;

  let bar: ReactNode;
  if (profile === "round") {
    bar = (
      <mesh material={mat} position={[0, 0, barZ]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[t / 2, L - t, 8, 32]} />
      </mesh>
    );
  } else if (profile === "fluted") {
    bar = <mesh material={mat} position={[0, 0, barZ]} geometry={flutedGeometry(L, t / 2, num(config, "flutes", 10))} />;
  } else {
    bar = (
      <RoundedBox args={[L, t, depth]} radius={Math.min(edge, depth / 2.1)} smoothness={3} position={[0, 0, barZ]} material={mat} />
    );
  }

  return (
    <group>
      {bar}
      {[-centres / 2, centres / 2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh material={mat} position={[0, 0, postLen / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[postR, postR * 1.08, postLen, 24]} />
          </mesh>
          <mesh material={mat} position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[postR * 1.9, postR * 2.05, 0.024, 32]} />
          </mesh>
          <mesh material={mat} position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[postR * 1.25, postR * 0.18, 8, 32]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------------- Knobs ---------------- */

export function KnobModel({ config, finish, scope = "shared" }: ModelProps) {
  const D = num(config, "diameter", 32) * S;
  const proj = num(config, "projection", 34) * S;
  const baseD = num(config, "baseDiameter", 20) * S;
  const mat = getMaterial(finish, scope);
  const headZ = proj - D / 2;
  const stemLen = headZ;
  return (
    <group>
      <mesh material={mat} position={[0, 0, headZ]}>
        <sphereGeometry args={[D / 2, 48, 32]} />
      </mesh>
      <mesh material={mat} position={[0, 0, headZ - D * 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[D * 0.2, D * 0.04, 10, 40]} />
      </mesh>
      <mesh material={mat} position={[0, 0, stemLen / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[D * 0.17, D * 0.26, stemLen, 32]} />
      </mesh>
      <mesh material={mat} position={[0, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[baseD / 2, baseD / 2 + 0.01, 0.03, 40]} />
      </mesh>
    </group>
  );
}

/* ---------------- Hinges ---------------- */

function leafGeometry(W: number, H: number, T: number) {
  return memoGeo(`leaf:${W}:${H}:${T}`, () => {
    const r = Math.min(W, H) * 0.12;
    const s = new THREE.Shape();
    s.moveTo(0, -H / 2);
    s.lineTo(W - r, -H / 2);
    s.quadraticCurveTo(W, -H / 2, W, -H / 2 + r);
    s.lineTo(W, H / 2 - r);
    s.quadraticCurveTo(W, H / 2, W - r, H / 2);
    s.lineTo(0, H / 2);
    s.lineTo(0, -H / 2);
    const holeR = W * 0.11;
    const holes = H > 0.9 ? [-0.34, 0, 0.34] : [-0.3, 0.3];
    for (const f of holes) {
      const h = new THREE.Path();
      h.absarc(W * 0.58, f * H, holeR, 0, Math.PI * 2, true);
      s.holes.push(h);
    }
    const g = new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false, curveSegments: 20 });
    g.translate(0, 0, -T / 2);
    return g;
  });
}

export function HingeModel({ config, finish, scope = "shared", animate }: ModelProps) {
  const H = num(config, "height", 100) * S;
  const W = num(config, "leafWidth", 32) * S;
  const T = num(config, "thickness", 2.5) * S;
  const K = Math.max(3, Math.round(num(config, "knuckles", 5)));
  const open = (num(config, "openAngle", 150) * Math.PI) / 180;
  const R = T * 2.1;
  const mat = getMaterial(finish, scope);
  const leaf = leafGeometry(W, H, T);
  const leafB = useRef<THREE.Group>(null);
  const segH = H / K;
  const gap = segH * 0.04;

  useFrame(({ clock }) => {
    if (!leafB.current) return;
    const a = animate ? open + Math.sin(clock.elapsedTime * 0.8) * 0.35 - 0.2 : open;
    leafB.current.rotation.y = Math.PI - a;
  });

  return (
    <group>
      <mesh geometry={leaf} material={mat} position={[R * 0.6, 0, 0]} />
      <group ref={leafB} rotation={[0, Math.PI - open, 0]}>
        <mesh geometry={leaf} material={mat} position={[R * 0.6, 0, 0]} />
      </group>
      {Array.from({ length: K }, (_, i) => (
        <mesh key={i} material={mat} position={[0, -H / 2 + segH * (i + 0.5), 0]}>
          <cylinderGeometry args={[R, R, segH - gap, 28]} />
        </mesh>
      ))}
      {[-1, 1].map((d) => (
        <mesh key={d} material={mat} position={[0, d * (H / 2 + R * 0.25), 0]}>
          <cylinderGeometry args={[R * 0.8, R * 0.8, R * 0.5, 24]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Drawer channels ---------------- */

function cProfile(L: number, w: number, h: number, t: number) {
  return memoGeo(`c:${L}:${w}:${h}:${t}`, () => {
    const s = new THREE.Shape();
    const lip = t * 2.2;
    s.moveTo(0, 0);
    s.lineTo(w, 0);
    s.lineTo(w, lip);
    s.lineTo(w - t, lip);
    s.lineTo(w - t, t);
    s.lineTo(t, t);
    s.lineTo(t, h - t);
    s.lineTo(w - t, h - t);
    s.lineTo(w - t, h - lip);
    s.lineTo(w, h - lip);
    s.lineTo(w, h);
    s.lineTo(0, h);
    s.lineTo(0, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: L, bevelEnabled: false });
    g.rotateY(-Math.PI / 2); // extrusion -> -X, profile width -> +Z
    g.translate(L / 2, -h / 2, 0);
    return g;
  });
}

function bracketGeometry(w: number, h: number, t: number) {
  return memoGeo(`br:${w}:${h}:${t}`, () => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, -h / 2);
    s.lineTo(w / 2, -h / 2);
    s.lineTo(w / 2, h / 2);
    s.lineTo(-w / 2, h / 2);
    s.lineTo(-w / 2, -h / 2);
    for (const y of [-h * 0.3, h * 0.3]) {
      const p = new THREE.Path();
      p.absellipse(0, y, w * 0.12, w * 0.2, 0, Math.PI * 2, true, 0);
      s.holes.push(p);
    }
    const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 16 });
    g.rotateY(Math.PI / 2);
    return g;
  });
}

export function ChannelModel({ config, finish, scope = "shared", animate }: ModelProps) {
  const L = num(config, "length", 450) * S;
  const h = num(config, "height", 45) * S;
  const w = num(config, "width", 12.7) * S;
  const t = 0.012;
  const mat = getMaterial(finish, scope);
  const bearingMat = getMaterial("brushed-chrome", scope);
  const plastic = getAccent("plastic");
  const hole = getAccent("hole");
  const middle = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const balls = useRef<THREE.InstancedMesh>(null);

  const ballR = 0.016;
  const perRow = 9;
  const h2 = h * 0.82;
  const w2 = w * 0.62;

  useLayoutEffect(() => {
    const m = balls.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (const y of [h2 / 2 - ballR * 1.1, -h2 / 2 + ballR * 1.1]) {
      for (let k = 0; k < perRow; k++) {
        o.position.set(-L * 0.25 + k * ballR * 2.6, y, t + w2 * 0.5);
        o.updateMatrix();
        m.setMatrixAt(i++, o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, [L, h2, w2]);

  useFrame(({ clock }) => {
    const e = animate ? 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.7) : 0.55;
    if (middle.current) middle.current.position.x = e * L * 0.42;
    if (inner.current) inner.current.position.x = e * L * 0.82;
  });

  const holesX = [-0.38, -0.12, 0.12, 0.38];
  return (
    <group>
      <mesh geometry={cProfile(L, w, h, t)} material={mat} />
      {holesX.map((f) => (
        <mesh key={f} material={hole} position={[f * L, 0, t + 0.0015]}>
          <circleGeometry args={[0.022, 20]} />
        </mesh>
      ))}
      <mesh geometry={bracketGeometry(w * 2.4, h * 1.25, t)} material={mat} position={[-L / 2 - t, 0, w * 0.6]} />
      <group ref={middle}>
        <mesh geometry={cProfile(L * 0.96, w2, h2, t * 0.85)} material={mat} position={[0, 0, t * 1.4]} />
        <instancedMesh ref={balls} args={[undefined, undefined, perRow * 2]} material={bearingMat}>
          <sphereGeometry args={[ballR, 12, 10]} />
        </instancedMesh>
      </group>
      <group ref={inner}>
        <mesh material={mat} position={[0, 0, t * 2.6 + 0.02]}>
          <boxGeometry args={[L * 0.92, h * 0.58, t]} />
        </mesh>
        <mesh material={plastic} position={[L * 0.44, 0, t * 2.6 + 0.04]}>
          <boxGeometry args={[0.18, h * 0.32, 0.035]} />
        </mesh>
      </group>
    </group>
  );
}

const MODELS: Record<ModelType, (p: ModelProps) => ReactNode> = {
  handle: HandleModel,
  knob: KnobModel,
  hinge: HingeModel,
  channel: ChannelModel,
};

export function ProductModel({ type, ...props }: ModelProps & { type: ModelType }) {
  const C = MODELS[type];
  return <C {...props} />;
}

/** Centres children and scales them so the largest dimension equals `size`. */
export function Fit({ size, deps, children }: { size: number; deps: unknown[]; children: ReactNode }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const box = useMemo(() => new THREE.Box3(), []);
  useLayoutEffect(() => {
    const o = outer.current;
    const g = inner.current;
    if (!o || !g) return;
    g.position.set(0, 0, 0);
    o.updateWorldMatrix(true, true);
    const inv = o.matrixWorld.clone().invert();
    box.makeEmpty();
    const tmp = new THREE.Box3();
    g.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || (mesh as unknown as THREE.InstancedMesh).isInstancedMesh) return;
      mesh.geometry.computeBoundingBox();
      tmp.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld.clone().premultiply(inv));
      box.union(tmp);
    });
    if (box.isEmpty()) return;
    const s = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    g.position.copy(c).multiplyScalar(-1);
    o.scale.setScalar(size / Math.max(s.x, s.y, s.z));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}
