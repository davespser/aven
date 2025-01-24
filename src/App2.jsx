import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const Tile = ({ position, material }) => (
  <mesh position={position, texture} receiveShadow>
    <boxGeometry args={[500, 2, 500]} />
    <meshStandardMaterial
      map={texture} // Textura aplicada
      emissive={new THREE.Color(0xaaaaaa)} // Emisión para mejorar visibilidad
      emissiveIntensity={0.5} // Intensidad de emisión
      roughness={0.2} // Control de rugosidad
      metalness={0.1} // Control de metalicidad
      side={THREE.DoubleSide}
    />
  </mesh>
);

const TiledOceanFloor = () => {
  const texture = useTexture("./textures/fondo2.jpg"); // Textura para los tiles
  const mapSize = 22; // Tamaño de la cuadrícula (40x40 tiles)
  THREE.sRGBEncoding; // Ajuste de gamma

  // Configuración de la textura
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(mapSize, mapSize); // Ajustar repetición para abarcar todos los tiles

  const material = useMemo(
    () => ({
      map: texture,
      color: new THREE.Color(0x2b1a49), // Color base del fondo
      side: THREE.DoubleSide,
    }),
    [texture]
  );

  // Generar posiciones para los tiles
  const tiles = useMemo(() => {
    const tileArray = [];
    for (let x = 0; x < mapSize; x++) {
      for (let z = 0; z < mapSize; z++) {
        tileArray.push([x - mapSize / 2, -1, z - mapSize / 2]); // Ajustar posición de cada tile
      }
    }
    return tileArray;
  }, [mapSize]);

  return (
    <group>
      {tiles.map((position, index) => (
        <Tile key={index}
        position={position}
        texture={texture}
        material={material} />
      ))}
    </group>
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

const Ocean = () => {
  const waveTexture = useTexture("./textures/olas.png");
  const materialRef = React.useRef();

  // Configuración de la textura del océano
  waveTexture.wrapS = THREE.RepeatWrapping;
  waveTexture.wrapT = THREE.RepeatWrapping;
  waveTexture.repeat.set(50, 50);

  // Animación de las olas
  React.useEffect(() => {
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
    <>
      {/* Océano */}
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

      {/* Fondo marino tileado */}
      <TiledOceanFloor />
    </>
  );
};

const App = () => {
  return (
    <Canvas
      shadows
      style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}
      camera={{ position: [50, 50, 50], fov: 100 }}
    >
      <ambientLight intensity={4.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Skybox /> {/* Cielo cúbico */}
      <Ocean /> {/* Océano y fondo marino */}
      <OrbitControls /> {/* Control orbital */}
    </Canvas>
  );
};

export default App;