import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Plane, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Ocean = () => {
  const waveTexture = useTexture('./textures/olas.png'); // Cargamos la textura de las olas
  const materialRef = useRef();

  // Configuración para repetir la textura
  waveTexture.wrapS = THREE.RepeatWrapping;
  waveTexture.wrapT = THREE.RepeatWrapping;
  waveTexture.repeat.set(10, 10); // Repetir la textura 10x10 en toda la superficie

  useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        // Desplazamiento de la textura en el tiempo
        waveTexture.offset.y += 0.01; // Movimiento vertical
        waveTexture.offset.x += 0.005; // Movimiento horizontal
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [waveTexture]);

  return (
    <>
      {/* Plano del océano */}
      <Plane args={[100, 100, 100, 100]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={materialRef}
          map={waveTexture} // Asignamos la textura de las olas
          color={new THREE.Color(0x4A90E2)} // Azul para el agua
          transparent={true}
          opacity={0.7} // Transparencia más apreciable
          side={THREE.DoubleSide}
        />
      </Plane>
      
      {/* Plano del fondo */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color={new THREE.Color(0x2E2B5F)} side={THREE.DoubleSide} />
      </Plane>
    </>
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
      camera={{ position: [50, 50, 50], fov: 75 }} // Posición inicial de la cámara
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Ocean />
      <OrbitControls /> {/* Cámara orbital */}
    </Canvas>
  );
};

export default App;