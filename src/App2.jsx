import React from "react";
import { Canvas } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Ocean = () => {
  const waveTexture = useTexture('./textures/olas.png'); // Cargamos la textura de las olas

  return (
    <Plane args={[100, 100, 100, 100]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        map={waveTexture} // Asignamos la textura de las olas
        side={THREE.DoubleSide}
        transparent={true}
        opacity={1}
        repeat={new THREE.Vector2(1, 1)} // Repite la textura
      />
    </Plane>
  );
};

const App = () => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Ocean />
    </Canvas>
  );
};

export default App;