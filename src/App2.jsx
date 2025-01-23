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
        materialRef.current.uniforms.uTime.value += 0.01; // Incrementar tiempo para animar
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Plane args={[100, 100, 100, 100]} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 }, // Tiempo para animar las olas
          uWaveTexture: { value: waveTexture }, // Textura de olas
          uColor: { value: new THREE.Color(0x4A90E2) }, // Color azul del agua
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
};

// Vertex Shader: Anima las posiciones de los vértices para simular olas
const vertexShader = `
  varying vec2 vUv; // Coordenadas UV para el fragment shader
  uniform float uTime; // Tiempo para animación

  void main() {
    vUv = uv; // Pasamos las coordenadas UV al fragment shader

    vec3 newPosition = position;
    // Añadimos movimiento a las olas usando sin y cos
    newPosition.z += 0.5 * sin(0.2 * position.x + uTime) * cos(0.2 * position.y + uTime);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment Shader: Aplica la textura de olas y animación
const fragmentShader = `
  varying vec2 vUv; // Coordenadas UV desde el vertex shader
  uniform sampler2D uWaveTexture; // Textura de las olas
  uniform vec3 uColor; // Color base del agua
  uniform float uTime; // Tiempo para mover la textura

  void main() {
    // Mueve la textura ligeramente en el tiempo
    vec2 uv = vUv + vec2(uTime * 0.05, uTime * 0.05);

    // Aplica la textura de las olas
    vec4 wave = texture2D(uWaveTexture, uv);

    // Mezclamos el color base con la textura
    vec3 color = mix(uColor, wave.rgb, 0.5); // Ajusta el 0.5 para controlar la influencia de la textura

    gl_FragColor = vec4(color, wave.a); // Color final con transparencia
  }
`;

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