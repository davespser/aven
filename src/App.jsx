import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import TiledMap1 from './TiledMap1';
import TiledMap2 from './TiledMap2';
import ModeloPatio from './ModeloPatio';
import Interface from './Interface';

function Skybox() {
  // Cargar las texturas para cada cara del cubo
  const textures = useTexture({
    px: './models/px.png',
    nx: './models/nx.png',
    py: './textures/py.png',
    ny: './textures/ny.png',
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
}

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState('pandawa');

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
        {/* Skybox con cubo */}
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