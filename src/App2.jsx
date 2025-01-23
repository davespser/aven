import React from "react";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

function Skybox() {
  // Cargar las texturas para cada cara del cubo
  const textures = useLoader(TextureLoader, [
    "./textures/px.png", // +X
    "./textures/nx.png", // -X
    "./textures/py.png", // +Y
    "./textures/ny.png", // -Y
    "./textures/pz.png", // +Z
    "./textures/nz.png", // -Z
  ]);

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[2000, 2000, 2000]} />
      {textures.map((texture, index) => (
        <meshBasicMaterial
          key={index}
          map={texture}
          side={THREE.BackSide} // El lado interior del cubo
        />
      ))}
    </mesh>
  );
}