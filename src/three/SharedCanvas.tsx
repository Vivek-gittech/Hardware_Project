import { Canvas, useThree } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { setSharedEnv } from "./materials";

function EnvSetup() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(new RoomEnvironment(), 0.04);
    setSharedEnv(rt.texture);
    pm.dispose();
  }, [gl]);
  return null;
}

/**
 * One WebGL renderer for every catalogue card / showcase on the page.
 * Each <View> scissors its own rectangle; off-screen views are skipped.
 */
export default function SharedCanvas() {
  return (
    <Canvas
      eventSource={document.body}
      eventPrefix="client"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }}
    >
      <EnvSetup />
      <View.Port />
    </Canvas>
  );
}
