import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import type { MutableRefObject } from "react";
import type * as THREE from "three";
import { getVariant, type Product } from "@/lib/products";
import type { FinishId } from "./finishes";
import { Fit, ProductModel } from "./models";
import { StudioLights } from "./Studio";

export interface ControlsHandle {
  reset(): void;
  update(): void;
  object: THREE.Camera;
}

/** High-detail dedicated viewer for a single product (own renderer so fullscreen works). */
export default function DetailViewerImpl({
  product,
  variantId,
  finish,
  controlsRef,
}: {
  product: Product;
  variantId: string;
  finish: FinishId;
  controlsRef: MutableRefObject<ControlsHandle | null>;
}) {
  const v = getVariant(product, variantId);
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.4, 6], fov: 32 }} gl={{ antialias: true }}>
      <color attach="background" args={["#0a0a0d"]} />
      <Environment resolution={256}>
        <Lightformer intensity={2.5} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={1.5} color="#8f88ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1.5, 1]} />
        <Lightformer intensity={1.2} color="#ffd8a8" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[20, 1.5, 1]} />
        <Lightformer intensity={0.8} position={[0, 0, 6]} scale={[6, 3, 1]} />
      </Environment>
      <StudioLights />
      <group rotation={product.displayRotation}>
        <Fit size={3} deps={[product.id]}>
          <ProductModel
            type={product.modelType}
            config={{ ...product.modelConfig, ...v.config }}
            finish={finish}
            scope="detail"
            animate={product.modelType === "channel" || product.modelType === "hinge"}
          />
        </Fit>
      </group>
      <ContactShadows position={[0, -1.9, 0]} opacity={0.55} scale={9} blur={2.6} far={4} />
      <OrbitControls
        ref={controlsRef as never}
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={2.5}
        maxDistance={11}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI - 0.6}
      />
    </Canvas>
  );
}
