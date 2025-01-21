import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const CHARACTER_MODELS = {
  yopuka: '/aven/models/yopuka.glb',
  pandawa: '/aven/models/pandawa.glb',
};

const CHARACTER_SCALES = {
  yopuka: [0.02, 0.02, 0.02], // Escala para Yopuka
  pandawa: [1, 1, 1], // Escala para Pandawa
};

export default function Character({ characterType = 'pandawa', position }) {
  const { scene } = useGLTF(CHARACTER_MODELS[characterType]);

  const scaledScene = useMemo(() => {
    const clonedScene = scene.clone();
    const scale = CHARACTER_SCALES[characterType]; // Obtiene la escala según el tipo de personaje
    clonedScene.scale.set(...scale); // Aplica la escala correspondiente
    clonedScene.castShadow = true;
    clonedScene.receiveShadow = true;
    return clonedScene;
  }, [scene, characterType]);

  return (
    <primitive
      object={scaledScene}
      position={position}
    />
  );
}