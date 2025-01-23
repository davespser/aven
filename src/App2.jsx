import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Plane, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Ocean = () => {
  const waveTexture = useTexture('./textures/olas.png'); // Cargamos la textura de las olas
  const materialRef = useRef();
  const planeRef = useRef();

  // Configuración para repetir la textura
  waveTexture.wrapS = THREE.RepeatWrapping;
  waveTexture.wrapT = THREE.RepeatWrapping;
  waveTexture.repeat.set(10, 10); // Repetir la textura 10x10 en toda la superficie

  useEffect(() => {
    const animateTexture = () => {
      if (materialRef.current) {
        // Desplazamiento de la textura en el tiempo
        waveTexture.offset.y += 0.005; // Movimiento vertical
        waveTexture.offset.x += 0.0025; // Movimiento horizontal
      }
      requestAnimationFrame(animateTexture);
    };
    animateTexture();
  }, [waveTexture]);

  useFrame(({ clock }) => {
    if (planeRef.current) {
      const time = clock.getElapsedTime();
      const vertices = planeRef.current.geometry.attributes.position.array;

      // Animar los vértices para simular oleaje
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        vertices[i + 2] = Math.sin((x + time) * 0.3) * 0.5 + Math.cos((y + time) * 0.2) * 0.3; // Modificar la posición Z
      }

      planeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Plano del océano */}
      <Plane
        args={[100, 100, 100, 100]} // Más subdivisiones para un oleaje suave
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          ref={materialRef}
          map={waveTexture} // Asignamos la textura de las olas
          color={new THREE.Color(0xFFFFFF)} // Azul para el agua
          transparent={true}
          opacity={0.7} // Transparencia más apreciable
          side={THREE.DoubleSide}
        />
      </Plane>

      {/* Plano del fondo */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color={new THREE.Color(0x009fff)} side={THREE.DoubleSide} />
      </Plane>
    </>
  );
};

const App = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = canvasRef.current.scene;
    const loader = new THREE.CubeTextureLoader();

    // Cargamos la textura cúbica
    const texture = loader.load([
      './textures/cubemap.png', // Imagen para todos los lados del cubemap
      './textures/cubemap.png',
      './textures/cubemap.png',
      './textures/cubemap.png',
      './textures/cubemap.png',
      './textures/cubemap.png',
    ]);

    scene.background = texture; // Establecemos el fondo de la escena con la textura cúbica
  }, []);

  return (
    <Canvas
      ref={canvasRef}
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