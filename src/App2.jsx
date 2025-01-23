import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Océano con textura en las crestas
const Ocean = () => {
  const materialRef = useRef();
  const waveTexture = useTexture("./textures/olas.png"); // Cargar la textura de las olas

  useEffect(() => {
    // Animación del océano (incrementa el tiempo)
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.02;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* Plano subdividido 100x100 para el movimiento */}
      <planeGeometry args={[100, 100, 100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x0066cc) }, // Azul para el agua
          uOpacity: { value: 0.8 }, // Transparencia del agua
          uWaveTexture: { value: waveTexture }, // Textura para las crestas de las olas
        }}
      />
    </mesh>
  );
};

// Vertex Shader: Movimiento de las olas
const vertexShader = `
  varying vec2 vUv;
  varying float vWaveStrength;
  uniform float uTime;

  void main() {
    vUv = uv;

    // Movimiento en Z para simular olas
    vec3 newPosition = position;
    newPosition.z += 0.5 * sin(10.0 * (position.x + uTime)) * 0.2;
    newPosition.z += 0.5 * sin(10.0 * (position.y + uTime)) * 0.2;

    // Calcular la fuerza de las olas para usarla en el fragment shader
    vWaveStrength = abs(sin(10.0 * (position.x + uTime)) + sin(10.0 * (position.y + uTime)));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment Shader: Toon Shading y textura en las crestas
const fragmentShader = `
  varying vec2 vUv;
  varying float vWaveStrength;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform sampler2D uWaveTexture;

  void main() {
    // Simulación de luz direccional
    float light = dot(vec3(0.0, 0.0, 1.0), normalize(vec3(0.5, 0.5, 1.0)));

    // Toon shading dividiendo la luz en tonos
    float shadedLight = smoothstep(0.2, 0.8, light);

    // Aplicar la textura de las crestas de las olas
    vec4 waveTexture = texture2D(uWaveTexture, vUv * 5.0); // Escalar la textura para que se repita
    vec3 waveColor = mix(uColor, waveTexture.rgb, vWaveStrength); // Mezclar la textura con el color base

    // Resultado final con transparencia
    gl_FragColor = vec4(waveColor * shadedLight, uOpacity);
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