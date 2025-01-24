import React, { useMemo, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const Tile = ({ position, material }) => (
  <mesh position={position} receiveShadow>
    <boxGeometry args={[150, 0.1, 150]} /> {/* Tamaño ajustable */}
    <meshStandardMaterial {...material} />
  </mesh>
);

const TiledOceanFloor = () => {
  const texture = useTexture("./textures/fondo2.jpg");
  const mapSize = 10; // Tamaño del plano tileado

  // Configuración de textura
  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(mapSize, mapSize); // Ajustar repetición
    texture.needsUpdate = true; // Asegurar que los cambios se reflejen
  }, [texture, mapSize]);

  // Material para las tiles (sin animaciones)
  const material = useMemo(
    () => ({
      map: texture,
      emissive: new THREE.Color(0x2b1a49),
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide,
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

const Ocean = () => {
  const waveTexture = useTexture("./textures/olas.png");
  const materialRef = useRef();

  // Configuración de textura del océano
  useEffect(() => {
    waveTexture.wrapS = THREE.RepeatWrapping;
    waveTexture.wrapT = THREE.RepeatWrapping;
    waveTexture.repeat.set(50, 50);
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
        transparent={false}
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas
      shadows
      style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}
      camera={{ position: [50, 50, 50], fov: 100 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <Skybox /> {/* Cielo cúbico */}
      <Ocean /> {/* Océano */}
      <TiledOceanFloor /> {/* Fondo marino tileado */}
      <OrbitControls /> {/* Control orbital */}
    </Canvas>
  );
};

export default App;