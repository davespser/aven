import React, { useRef, useEffect, } from "react";
import { Canvas } from "@react-three/fiber";
import { Plane, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Skybox() {
  // Cargar las texturas para cada cara del cubo
  const textures = useTexture({
    px: './textures/py.png',
    nx: './textures/ny.png',
    py: './textures/nx.png',
    ny: './textures/px.png',
    pz: './textures/pz.png',
    nz: './textures/nz.png',
  });

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[2000, 2000, 2000]} />
      <meshBasicMaterial attach="material-0" map={textures.px} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-1" map={textures.nx} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-2" map={textures.py} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-3" map={textures.ny} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-4" map={textures.pz} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-5" map={textures.nz} side={THREE.BackSide} />
    </mesh>
  );
}

const OceanTile = ({ position }) => {
  const materialRef = useRef();

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
    <Plane args={[40, 40, 64, 64]} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true} // Habilita la transparencia
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x31004E) },
          uOpacity: { value: 0.6 }, // Controla la opacidad
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
    <Canvas shadows
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onCreated={({ gl }) => {
          gl.setSize(window.innerWidth, window.innerHeight);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          const resizeHandler = () => {
            gl.setSize(window.innerWidth, window.innerHeight);
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          };
          window.addEventListener('resize', resizeHandler);
          return () => window.removeEventListener('resize', resizeHandler);
        }}
        camera={{ position: [0, 20, 30], fov: 75 }}>
              {/* Skybox con cubo */}
        <Skybox />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OceanGrid />
    </Canvas>
  );
};

export default App;