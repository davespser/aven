import React, { useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CubeTextureLoader } from 'three';
import TiledMap1 from './TiledMap1';
import TiledMap2 from './TiledMap2';
import ModeloPatio from './ModeloPatio';
import Interface from './Interface';

function Skybox() {
  // Cargar las texturas del skybox
  const texture = useLoader(CubeTextureLoader, [
    '/textures/px.png',
    '/textures/nx.png',
    '/textures/py.png',
    '/textures/ny.png',
    '/textures/pz.png',
    '/textures/nz.png',
  ]);

  return (
    <primitive attach="background" object={texture} />
  );
}

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState("pandawa");

  return (
    <>
      <Canvas
        shadows
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
      >
        {/* Skybox personalizado */}
        <Skybox />

        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 2, 3]} intensity={1.5} castShadow />
        <PerspectiveCamera makeDefault position={[0, 20, 30]} fov={75} />

        {/* Primer mapa (TiledMap1) */}
        <group position={[-5, 0, 0]}>
          <TiledMap1 selectedCharacter={selectedCharacter} />
        </group>

        {/* Segundo mapa (TiledMap2) */}
        <group position={[-5, -0.001, 0]}>
          <TiledMap2 />
        </group>

        {/* Componente ModeloPatio */}
        <group position={[-5.5, 3, -0.7]}>
          <ModeloPatio />
        </group>

        {/* Controles de cámara */}
        <OrbitControls />
      </Canvas>

      {/* Interfaz de usuario */}
      <Interface onSelectCharacter={(model) => setSelectedCharacter(model)} />
    </>
  );
}