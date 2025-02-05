import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, useTexture } from '@react-three/drei'; // Importar OrthographicCamera
import * as THREE from 'three'; // Importar THREE
import TiledMap1 from './TiledMap1';
import TiledMap2 from './TiledMap2';
import ModeloPatio from './ModeloPatio';
import Interface from './Interface';

function Skybox() {
  // Cargar las texturas para cada cara del cubo
  const textures = useTexture({
    px: './models/py.png',
    nx: './models/ny.png',
    py: './textures/nx.png',
    ny: './textures/px.png',
    pz: './textures/pz.png',
    nz: './textures/nz.png',
  });

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[2000, 2000, 2000]} /> {/* Tamaño del cubo */}
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
        <ambientLight intensity={4.5} />
        <directionalLight position={[1, 2, 3]} intensity={1.5} castShadow />

        {/* Cámara Ortográfica */}
        <OrthographicCamera 
          makeDefault 
          position={[10, 20, 10]} 
          zoom={25} 
          near={0.1} 
          far={2000} 
          rotation={[-Math.PI / 4, Math.PI / 4, 0]} // Rotación para vista isométrica
        />

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