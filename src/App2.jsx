  import React from "react"; import { Canvas } from "@react-three/fiber"; import { Plane, OrbitControls } from "@react-three/drei"; import * as THREE from "three"; import { useTexture } from "@react-three/drei";

const Ocean = () => { const waveTexture = useTexture('./textures/olas.png'); // Cargamos la textura de las olas

// Configuración para repetir la textura waveTexture.wrapS = THREE.RepeatWrapping; waveTexture.wrapT = THREE.RepeatWrapping; waveTexture.repeat.set(10, 10); // Repetir la textura 10x10 en toda la superficie

return ( <Plane args={[100, 100, 100, 100]} rotation={[-Math.PI / 2, 0, 0]}> <meshStandardMaterial map={waveTexture} // Asignamos la textura de las olas side={THREE.DoubleSide} transparent={true} opacity={1} /> </Plane> ); };

const App = () => { return ( <Canvas style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, }} camera={{ position: [50, 50, 50], fov: 75 }} // Posición inicial de la cámara > <ambientLight intensity={0.5} /> <directionalLight position={[10, 10, 5]} intensity={1} /> <Ocean /> <OrbitControls /> {/* Cámara orbital */} </Canvas> ); };

export default App;

