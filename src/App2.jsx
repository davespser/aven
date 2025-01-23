import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

const OceanTile = () => {
  const materialRef = useRef();

  // Actualiza el desplazamiento del material para crear un efecto de movimiento
  React.useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.02;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Plane args={[10, 10, 64, 64]} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x0077be) },
        }}
      />
    </Plane>
  );
};

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 newPosition = position;
    newPosition.z += sin(position.x * 2.0 + uTime) * 0.2;
    newPosition.z += cos(position.y * 2.0 + uTime) * 0.2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;

  void main() {
    float wave = sin(vUv.y * 10.0) * 0.1;
    vec3 color = uColor + vec3(wave, wave * 0.5, 0.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const App = () => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OceanTile />
    </Canvas>
  );
};

export default App;