import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { BoxGeometry, EdgesGeometry } from 'three';
import { a, useSpring } from '@react-spring/three';
import Character from './character'; // Componente del personaje

function Tile({ position, material, lineMaterial, isSelected, onClick }) {
  const edges = useMemo(() => {
    const geometry = new BoxGeometry(1, 0.2, 1);
    const edgesGeometry = new EdgesGeometry(geometry);
    const lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeometry);
    return new LineSegments2(lineSegmentsGeometry, lineMaterial);
  }, [lineMaterial]);

  const { scale } = useSpring({
    scale: isSelected ? 1.2 : 1,
    config: { tension: 300, friction: 20 },
  });

  return (
    <a.group position={position} scale={scale} onClick={onClick}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshPhysicalMaterial {...material} color={isSelected ? 'blue' : material.color} />
      </mesh>
      <primitive object={edges} />
      {isSelected && (
        <spotLight position={[0, 5, 0]} angle={0.5} intensity={2} penumbra={0.5} castShadow />
      )}
    </a.group>
  );
}

export default function TiledMap1({ selectedCharacter }) {
  const [selectedTile, setSelectedTile] = useState(null); // Estado del tile seleccionado
  const mapSize = 10;

  // Estado y animación para la posición del personaje
  const [characterPosition, setCharacterPosition] = useState([0, 0.5, 0]);
  const [springProps, api] = useSpring(() => ({
    position: characterPosition,
    config: { tension: 200, friction: 25 },
  }));

  // Maneja el clic en un tile y actualiza la posición del personaje
  const handleTileClick = (tile) => {
    const [x, z] = tile.id.split('-').map(Number);
    setSelectedTile(tile.id);
    const newPosition = [x - mapSize / 2, 0.5, z - mapSize / 2];
    setCharacterPosition(newPosition);
    api.start({ position: newPosition }); // Actualiza la animación hacia la nueva posición
  };

  // Material del tile (iceMaterial)
  const iceMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: '#d4f1f9',
      transparent: true,
      opacity: 0.8,
      transmission: 0.2,
      roughness: 0.9,
      metalness: 0.5,
      clearcoat: 0.9,
      clearcoatRoughness: 2,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };

      shader.vertexShader = `
        varying vec3 vWorldPos;
        uniform float time;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float voronoi(vec2 p) {
          vec2 g = floor(p);
          vec2 f = fract(p);
          float d = 1.0;
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 lattice = vec2(x, y);
              vec2 offset = vec2(hash(g + lattice), hash(g.yx + lattice));
              vec2 r = lattice + offset - f;
              d = min(d, dot(r, r));
            }
          }
          return d;
        }

        ${shader.vertexShader}
      `.replace(
        `#include <worldpos_vertex>`,
        `
        #include <worldpos_vertex>
        vWorldPos = position;

        float cracks = voronoi(position.xz * 5.0 + time * 2.5);
        cracks = smoothstep(0.1, 0.15, cracks);
        transformed.z += cracks * 1.8;
        `
      );

      shader.fragmentShader = `
        varying vec3 vWorldPos;
        uniform float time;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float voronoi(vec2 p) {
          vec2 g = floor(p);
          vec2 f = fract(p);
          float d = 2.0;
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 lattice = vec2(x, y);
              vec2 offset = vec2(hash(g + lattice), hash(g.yx + lattice));
              vec2 r = lattice + offset - f;
              d = min(d, dot(r, r));
            }
          }
          return d;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <roughnessmap_fragment>`,
        `
        #include <roughnessmap_fragment>
        float cracks = voronoi(vWorldPos.xz * 50.0 + time * 1.5);
        cracks = smoothstep(0.1, 0.06, cracks);
        roughnessFactor = mix(roughnessFactor, cracks, 2.8);
        `
      );
    };

    return material;
  }, []);

  // Material para las líneas del tile
  const lineMaterial = useMemo(() => {
    const material = new LineMaterial({
      color: 'black',
      linewidth: 0.8,
    });
    material.resolution.set(window.innerWidth, window.innerHeight);
    return material;
  }, []);

  // Generar los tiles del mapa
  const tiles = useMemo(() => {
    const tileArray = [];
    for (let x = 0; x < mapSize; x++) {
      for (let z = 0; z < mapSize; z++) {
        tileArray.push({
          position: [x - mapSize / 2, 0, z - mapSize / 2],
          material: iceMaterial,
          lineMaterial,
          id: `${x}-${z}`,
        });
      }
    }
    return tileArray;
  }, [iceMaterial, lineMaterial]);

  return (
    <group>
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          {...tile}
          isSelected={selectedTile === tile.id}
          onClick={() => handleTileClick(tile)}
        />
      ))}

      {/* Renderizar el personaje */}
      <a.group position={springProps.position}>
        <Character characterType={selectedCharacter} />
      </a.group>
    </group>
  );
}