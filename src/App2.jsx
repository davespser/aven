import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Plane, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Skybox con texturas
function Skybox() {
  const textures = useTexture({
    px: './textures/py.png',
    nx: './textures/ny.png',
    py: './textures/nx.png',
    ny: './textures/px.png',
    pz: './textures/pz.png',
    nz: './textures/nz.png',
  });

  return (
    <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <boxGeometry args={[2000, 2000, 2000]} />
      <meshBasicMaterial attach="material-0" map={textures.px} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-1" map={textures.nx} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-2" map={textures.py} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-3" map={textures.ny} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-4" map={textures.pz} side={THREE.BackSide} />
      <meshBasicMaterial attach="material-5" map={textures.nz} side={THREE.BackSide} />
    </mesh>
  );
}

// OceanTile con Toon Shading
const OceanTile = ({ position }) => {
  const materialRef = useRef();
  const waveTexture = useTexture('./textures/olas.png'); // Cargamos la textura de las olas

  useEffect(() => {
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.02;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <Plane args={[40, 40, 64, 64]} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={oceanVertexShader} // Shader de vértices
        fragmentShader={toonFragmentShader} // Shader de toon shading
        transparent={true} // Habilita la transparencia
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x31004E) }, // Color base del océano
          uOpacity: { value: 0.4 }, // Control de opacidad
          uWaveTexture: { value: waveTexture }, // Pasamos la textura de las olas al shader
        }}
      />
    </Plane>
  );
};

// Vertex Shader: Movimiento de las olas
const oceanVertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    
    // Movimiento de las olas (combinando coseno y seno en función de uTime y las coordenadas de UV)
    vec3 modifiedPosition = position;
    
    // Se crea el movimiento en Z, usando las coordenadas (x, y) y el tiempo (uTime)
    modifiedPosition.z += 0.05 * (cos(0.5 + uTime + 100.0 * vUv.x) + sin(0.5 * uTime + 100.0 * vUv.y));
    
    // Aplicar la nueva posición
    gl_Position = projectionMatrix * modelViewMatrix * vec4(modifiedPosition, 1.0);
  }
`;

// Fragment Shader: Toon Shading y textura de olas
const toonFragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform sampler2D uWaveTexture; // Uniform para la textura de las olas

  void main() {
    // Obtenemos la luz direccional (simulada para este ejemplo)
    float light = dot(vec3(0.0, 0.0, 1.0), normalize(vec3(0.5, 0.5, 1.0))); 
    float shadedLight = smoothstep(0.2, 0.8, light); // Toon shading: divide la luz en tonos

    // Usamos la textura de las olas, haciendo que se mueva con el tiempo
    vec4 waveColor = texture2D(uWaveTexture, vUv * 5.0 + vec2(0.0, uTime * 0.1)); // Movimiento de la textura de olas

    // Mezclamos la textura con el color base dependiendo de la fuerza de la ola
    vec3 color = mix(uColor * shadedLight, waveColor.rgb, 0.8); // 0.8 ajusta la influencia de la textura
    
    gl_FragColor = vec4(color, uOpacity); // Control de opacidad
  }
`;

const OceanGrid = () => {
  const gridSize = 3; // Número de tiles en cada dirección (3x3 cuadrícula)
  const tileSize = 10; // Tamaño de cada tile (10x10 unidades)

  // Generar posiciones para los tiles
  const tiles = [];
  for (let x = -Math.floor(gridSize / 2); x <= Math.floor(gridSize / 2); x++) {
    for (let z = -Math.floor(gridSize / 2); z <= Math.floor(gridSize / 2); z++) {
      tiles.push([x * tileSize, 0, z * tileSize]);
    }
  }

  return (
    <>
      {tiles.map((position, index) => (
        <OceanTile key={index} position={position} />
      ))}
    </>
  );
};

const App = () => {
  return (
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
      camera={{ position: [0, 20, 30], fov: 75 }}
    >
      {/* Skybox con cubo */}
      <Skybox />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OceanGrid />
    </Canvas>
  );
};

export default App;