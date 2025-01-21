import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import TiledMap1 from './TiledMap1';
import TiledMap2 from './TiledMap2';
import ModeloPatio from './ModeloPatio';
import Interface from './Interface';

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState("pandawa"); // Estado para el personaje seleccionado

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
          // Configurar tamaño y pixel ratio iniciales
          gl.setSize(window.innerWidth, window.innerHeight);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          // Manejar cambios de tamaño dinámicamente
          const resizeHandler = () => {
            gl.setSize(window.innerWidth, window.innerHeight);
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          };
          window.addEventListener('resize', resizeHandler);

          // Limpiar el listener al desmontar
          return () => window.removeEventListener('resize', resizeHandler);
        }}
      >
        {/* Cielo dinámico */}
        <Sky
          distance={25} // Distancia del cielo
          sunPosition={[50, 100, 50]} // Posición del sol
          inclination={0.5} // Inclinación del sol
          azimuth={0.25} // Azimut (posición horizontal del sol)
        />

        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 2, 3]} intensity={1.5} castShadow />
        <PerspectiveCamera makeDefault position={[0, 20, 30]} fov={75} />

        {/* Primer mapa (TiledMap1) */}
        <group position={[-5, 0, 0]}>
          <TiledMap1 selectedCharacter={selectedCharacter} /> {/* Pasamos el personaje seleccionado */}
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
      <Interface onSelectCharacter={(model) => setSelectedCharacter(model)} /> {/* Actualizamos el personaje seleccionado */}
    </>
  );
}