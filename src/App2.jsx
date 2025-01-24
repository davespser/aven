import React, { useMemo, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Componente para una sola tile
const Tile = ({ position, material }) => (
  <mesh position={position} receiveShadow>
    <boxGeometry args={[1, 0.1, 1]} /> {/* Tamaño ajustable */}
    <meshStandardMaterial {...material} />
  </mesh>
);

// Fondo marino tileado
const TiledOceanFloor = () => {
  const texture = useTexture("./textures/olas2.jpg");
  const mapSize = 20; // Tamaño del plano tileado

  // Configuración de la textura (solo para el fondo, sin animaciones)
  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(mapSize, mapSize); // Repetir textura para cubrir todas las tiles
    texture.needsUpdate = true;
  }, [texture, mapSize]);

  // Material de las tiles
  const material = useMemo(
    () => ({
      map: texture,
      emissive: new THREE.Color(0x2b1a49),
      emissiveIntensity: 1,
      roughness: 0.8,
      metalness: 0.01,
      side: THREE.FrontSide,
    }),
    [texture]
  );

  // Generar posiciones para los tiles
  const tiles = useMemo(() => {
    const tileArray = [];
    for (let x = 0; x < mapSize; x++) {
      for (let z = 0; z < mapSize; z++) {
        tileArray.push([x - mapSize / 2, -1, z - mapSize / 2]);
      }
    }
    return tileArray;
  }, [mapSize]);

  return (
    <group>
      {tiles.map((position, index) => (
        <Tile key={index} position={position} material={material} />
      ))}
    </group>
  );
};

// Océano con animaciones
const Ocean = () => {
  const waveTexture = useTexture("./textures/olas.png");
  const materialRef = useRef();

  // Configuración de textura del océano
  useEffect(() => {
    waveTexture.wrapS = THREE.RepeatWrapping;
    waveTexture.wrapT = THREE.RepeatWrapping;
    waveTexture.repeat.set(50, 50); // Ajuste de repetición para el océano
    waveTexture.needsUpdate = true;
  }, [waveTexture]);

  // Animación de las olas
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 200, 200]} />
      <meshStandardMaterial
        ref={materialRef}
        map={waveTexture}
        color={new THREE.Color(0xffffff)}
        transparent={true}
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Skybox (cielo cúbico)
const Skybox = () => {
  const textures = useTexture({
    px: "./textures/px.png",
    nx: "./textures/nx.png",
    py: "./textures/py.png",
    ny: "./textures/ny.png",
    pz: "./textures/pz.png",
    nz: "./textures/nz.png",
  });

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[500, 500, 500]} />
      {Object.values(textures).map((texture, index) => (
        <meshBasicMaterial key={index} map={texture} side={THREE.BackSide} />
      ))}
    </mesh>
  );
};

// Aplicación principal
const App = () => {
  return (
    <Canvas
      shadows
      style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}
      camera={{ position: [50, 50, 50], fov: 100 }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 5]} intensity={0.5} castShadow />
      <Skybox /> {/* Cielo cúbico */}
      <Ocean /> {/* Océano animado */}
      <TiledOceanFloor /> {/* Fondo marino estático */}
      <OrbitControls /> {/* Control orbital */}
    </Canvas>
  );
};

export default App;