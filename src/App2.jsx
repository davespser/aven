import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Plane } from "@react-three/drei";
import * as THREE from "three";

const Ocean = () => {
  const waveTexture = useTexture('./textures/olas.png'); // Cargamos la textura de las olas
  const materialRef = useRef();

  // Configuración para repetir la textura
  waveTexture.wrapS = THREE.RepeatWrapping;
  waveTexture.wrapT = THREE.RepeatWrapping;
  waveTexture.repeat.set(50, 50); // Repetir la textura 10x10 en toda la superficie

  useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        waveTexture.offset.y += 0.005; // Movimiento vertical
        waveTexture.offset.x += 0.0025; // Movimiento horizontal
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [waveTexture]);

  return (
    <>
      {/* Plano del océano */}
      <Plane args={[200, 200, 200, 200]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={materialRef}
          map={waveTexture}
          color={new THREE.Color(0xFFFFFF)} // Azul para el agua
          transparent={true}
          opacity={0.7} // Transparencia más apreciable
          side={THREE.DoubleSide}
        />
      </Plane>

      {/* Plano del fondo */}
      <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color={new THREE.Color(0x2b1a49)} side={THREE.DoubleSide} />
      </Plane>
    </>
  );
};

const Skybox = () => {
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
      <boxGeometry args={[500, 500, 500]} /> {/* Tamaño del cubo */}
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
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      camera={{ position: [50, 50, 50], fov: 100 }}
    >
      <ambientLight intensity={4.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Skybox /> {/* Cielo cúbico */}
      <Ocean /> {/* Océano */}
      <OrbitControls /> {/* Cámara orbital */}
    </Canvas>
  );
};

export default App;