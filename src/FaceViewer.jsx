import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';

export default function FaceViewer() {
  const { scene } = useGLTF('/models/pandawa.glb'); // Load the model

  // Assuming 'face' is a named group or object in your GLB model
  const facePart = useMemo(() => {
    const face = scene.getObjectByName('face') || scene; // If 'face' isn't found, use the whole scene
    const clonedFace = face.clone();
    clonedFace.scale.set(0.5, 0.5, 0.5); // Scale down for interface display
    return clonedFace;
  }, [scene]);

  return (
    <Html>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        padding: '20px', 
        borderRadius: '10px', 
        position: 'absolute', 
        top: '10px', 
        left: '10px'
      }}>
        <h2>Character Face</h2>
        <div style={{ width: '200px', height: '200px' }}>
          <mesh>
            <primitive object={facePart} />
          </mesh>
        </div>
      </div>
    </Html>
  );
}