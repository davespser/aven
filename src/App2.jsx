import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import * as THREE from "three";

function Skybox() {
  // Cargar las texturas para cada cara del cubo
  const textures = useTexture({
    px: './models/py.png',
    nx: './models/ny.png',
    py: './textures/nx.png',
    ny: './textures/px.png',
    pz: './textures/pz.png',
    nz: './textures/nz.png',
  });

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[2000, 2000, 2000]} /> {/* Tamaño del cubo */}
      <meshBasicMaterial attachArray="material" map={textures.px} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.nx} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.py} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.ny} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.pz} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.nz} side={THREE.BackSide} />
    </mesh>
  );
}

const OceanTile = ({ position }) => {
  const materialRef = useRef();

  // Animación para las olas
  useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.02;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Plane args={[10, 10, 64, 64]} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x0077be) },
        }}
      />
    </Plane>
  );
};

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 newPosition = position;
    newPosition.z += sin(position.x * 2.0 + uTime) * 0.2;
    newPosition.z += cos(position.y * 2.0 + uTime) * 0.2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;

  void main() {
    float wave = sin(vUv.y * 10.0) * 0.1;
    vec3 color = uColor + vec3(wave, wave * 0.5, 0.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const OceanGrid = () => {
  const gridSize = 3; // Número de tiles en cada dirección (3x3 cuadrícula)
  const tileSize = 10; // Tamaño de cada tile (10x10 unidades)

  // Generar posiciones para los tiles
  const tiles = [];
  for (let x = -Math.floor(gridSize / 2); x <= Math.floor(gridSize / 2); x++) {
    for (let z = -Math.floor(gridSize / 2); z <= Math.floor(gridSize / 2); z++) {
      tiles.push([x * tileSize, 0, z * tileSize]);
    }
  }

  return (
    <>
      {tiles.map((position, index) => (
        <OceanTile key={index} position={position} />
      ))}
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
              {/* Skybox con cubo */}
        <Skybox />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OceanGrid />
    </Canvas>
  );
};

export default App;