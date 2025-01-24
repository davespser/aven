import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls , useTexture} from "@react-three/drei";
import * as THREE from "three";

// Componente para una sola tile
const Tile = ({ position, material }) => (
  <mesh position={position} receiveShadow>
    <boxGeometry args={[200, 0.1, 200]} /> {/* Tamaño ajustable */}
    <meshStandardMaterial {...material} />
  </mesh>
);

// Fondo marino tileado (sin textura, solo color)
const TiledOceanFloor = () => {
  const mapSize = 20; // Tamaño del plano tileado

  // Material de las tiles con solo color
  const material = useMemo(
    () => ({
      color: new THREE.Color(0x2b1a49),
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color(0x2b1a49),
      emissiveIntensity: 0.1,
    }),
    []
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

// Océano con olas animadas
const Ocean = () => {
  const waveTexture = useTexture("./textures/olas.png"); // Textura de olas
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 200, 200]} />
      <meshStandardMaterial
        ref={materialRef}
        map={waveTexture}
        color={new THREE.Color(0x87ceeb)}
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
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <Skybox /> {/* Cielo cúbico */}
      <Ocean /> {/* Océano con olas animadas */}
      <TiledOceanFloor /> {/* Fondo marino con color sólido */}
      <OrbitControls /> {/* Control orbital */}
    </Canvas>
  );
};

export default App;