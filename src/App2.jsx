import React, { useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Generar geometría de un mosaico hexagonal
const createHexagonalGrid = (radius, numHexagons) => {
  const hexRadius = radius / Math.sqrt(numHexagons / 2); // Aproximar el radio de cada hexágono
  const hexWidth = Math.sqrt(3) * hexRadius; // Ancho del hexágono
  const hexHeight = 2 * hexRadius; // Altura del hexágono
  const positions = [];
  const indices = [];
  let index = 0;

  // Crear una cuadrícula de hexágonos
  for (let row = 0; row < Math.sqrt(numHexagons); row++) {
    for (let col = 0; col < Math.sqrt(numHexagons); col++) {
      const x = col * hexWidth + (row % 2 === 0 ? 0 : hexWidth / 2);
      const z = row * (hexHeight * 0.75);
      const y = 0;

      // Crear vértices para el hexágono
      const hexVertices = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        hexVertices.push(new THREE.Vector3(
          x + hexRadius * Math.cos(angle),
          y,
          z + hexRadius * Math.sin(angle)
        ));
      }

      // Añadir posiciones y construir índices
      positions.push(...hexVertices.map(v => [v.x, v.y, v.z]).flat());
      for (let i = 0; i < 6; i++) {
        indices.push(index, index + i, index + ((i + 1) % 6));
      }
      index += 6;
    }
  }

  return { positions, indices };
};

const Ocean = () => {
  const waveTexture = useTexture("./textures/olas.png");
  const materialRef = useRef();

  // Generar malla de hexágonos
  const { positions, indices } = useMemo(() => createHexagonalGrid(100, 200), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [positions, indices]);

  // Configurar textura
  waveTexture.wrapS = THREE.RepeatWrapping;
  waveTexture.wrapT = THREE.RepeatWrapping;
  waveTexture.repeat.set(50, 50);

  useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        waveTexture.offset.y += 0.005;
        waveTexture.offset.x += 0.0025;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [waveTexture]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        map={waveTexture}
        color={new THREE.Color(0xffffff)}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Skybox = () => {
  const textures = useTexture({
    px: "./textures/py.png",
    nx: "./textures/ny.png",
    py: "./textures/nx.png",
    ny: "./textures/px.png",
    pz: "./textures/pz.png",
    nz: "./textures/nz.png",
  });

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[500, 500, 500]} />
      <meshBasicMaterial attachArray="material" map={textures.px} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.nx} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.py} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.ny} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.pz} side={THREE.BackSide} />
      <meshBasicMaterial attachArray="material" map={textures.nz} side={THREE.BackSide} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas
      shadows
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      camera={{ position: [50, 50, 50], fov: 100 }}
    >
      <ambientLight intensity={4.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Skybox />
      <Ocean />
      <OrbitControls />
    </Canvas>
  );
};

export default App;