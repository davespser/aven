import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane, useTexture } from "@react-three/drei";
import * as THREE from "three";

const Ocean = () => {
  const materialRef = useRef();
  const waveTexture = useTexture("./textures/olas.png"); // Cargar textura de las olas

  // Configuración para repetir la textura
  waveTexture.wrapS = THREE.RepeatWrapping;
  waveTexture.wrapT = THREE.RepeatWrapping;
  waveTexture.repeat.set(10, 10); // Repetir la textura 10x10

  useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.02; // Incrementar el tiempo para animación
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Plane args={[100, 100, 100, 100]} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uWaveTexture: { value: waveTexture }, // Pasar textura al vertex shader
          uColor: { value: new THREE.Color(0x0066cc) }, // Color azul del agua
          uOpacity: { value: 0.8 }, // Transparencia
        }}
        transparent={true}
      />
    </Plane>
  );
};

// Vertex Shader: Movimiento de las olas influenciado por la textura
const vertexShader = `
  varying vec2 vUv;
  varying float vWaveStrength;
  uniform float uTime;
  uniform sampler2D uWaveTexture; // Textura de las olas

  void main() {
    vUv = uv;

    // Leer la intensidad de la textura en las coordenadas UV
    float waveHeight = texture2D(uWaveTexture, uv).r; // Usar el canal rojo para altura

    // Movimiento en Z, afectado por la textura y el tiempo
    vec3 newPosition = position;
    float wave1 = sin(10.0 * (position.x + uTime)) * 0.2;
    float wave2 = cos(10.0 * (position.y + uTime)) * 0.2;
    newPosition.z += (wave1 + wave2) * waveHeight; // Modificar según la textura

    // Fuerza de las olas para usar en el fragment shader
    vWaveStrength = abs(wave1 + wave2) * waveHeight;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment Shader: Color con transparencia
const fragmentShader = `
  varying vec2 vUv;
  varying float vWaveStrength;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    // Base azul con sombreado básico
    float light = dot(vec3(0.0, 0.0, 1.0), normalize(vec3(0.5, 0.5, 1.0))); 
    float shadedLight = smoothstep(0.2, 0.8, light);

    // Color final mezclado con la intensidad de las olas
    vec3 finalColor = uColor * (1.0 - vWaveStrength) * shadedLight;

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

const App = () => {
  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      camera={{ position: [50, 50, 50], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Ocean />
      <OrbitControls />
    </Canvas>
  );
};

export default App;