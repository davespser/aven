import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { BoxGeometry, EdgesGeometry } from 'three';
import { a, useSpring } from '@react-spring/three';
import Character from './character'; // Importamos el componente del personaje

function Tile({ position, material, lineMaterial, isSelected, isAccessible, onClick }) {
  const edges = useMemo(() => {
    const geometry = new BoxGeometry(1, 0.2, 1);
    const edgesGeometry = new EdgesGeometry(geometry);
    const lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeometry);
    return new LineSegments2(lineSegmentsGeometry, lineMaterial);
  }, [lineMaterial]);

  // Animación de escala
  const { scale } = useSpring({
    scale: isSelected ? 1.2 : 1,
    config: { tension: 300, friction: 20 },
  });

  return (
    <a.group position={position} scale={scale} onClick={onClick}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshPhysicalMaterial 
          {...material} 
          color={isSelected ? 'blue' : isAccessible ? 'green' : material.color}
        />
      </mesh>
      <primitive object={edges} />
      {isSelected && (
        <spotLight
          position={[0, 5, 0]}
          angle={0.5}
          intensity={2}
          penumbra={0.5}
          castShadow
        />
      )}
    </a.group>
  );
}

export default function TiledMap1({ selectedCharacter }) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [characterPosition, setCharacterPosition] = useState([0, 0]); // Posición inicial
  const [accessibleTiles, setAccessibleTiles] = useState([]); // Tiles disponibles
  const mapSize = 10;

  const [springProps, api] = useSpring(() => ({
    position: [0, 0.5, 0],
    config: { tension: 200, friction: 25 },
  }));

  // Genera los tiles accesibles desde una posición inicial
  const getAccessibleTiles = (position, range) => {
    const [x, z] = position;
    const tiles = [];
    for (let i = -range; i <= range; i++) {
      for (let j = -range; j <= range; j++) {
        const newX = x + i;
        const newZ = z + j;
        if (
          newX >= 0 &&
          newX < mapSize &&
          newZ >= 0 &&
          newZ < mapSize &&
          Math.abs(i) + Math.abs(j) <= range
        ) {
          tiles.push(`${newX}-${newZ}`);
        }
      }
    }
    return tiles;
  };

  const handleTileClick = (tile) => {
    if (!accessibleTiles.includes(tile.id)) return; // Restringir clics
    const [x, z] = tile.id.split('-').map(Number);
    setSelectedTile(tile.id);
    const newPosition = [x - mapSize / 2, 0.5, z - mapSize / 2];
    api.start({ position: newPosition });
    setCharacterPosition([x, z]); // Actualizar posición
    setAccessibleTiles(getAccessibleTiles([x, z], 3)); // Actualizar tiles accesibles
  };

  // Inicializa los tiles accesibles
  useEffect(() => {
    setAccessibleTiles(getAccessibleTiles([0, 0], 3));
  }, []);

  const iceMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#d4f1f9',
      transparent: true,
      opacity: 0.8,
      transmission: 0.2,
      roughness: 0.9,
      metalness: 0.5,
      clearcoat: 0.9,
      clearcoatRoughness: 2,
    });
  }, []);

  const lineMaterial = useMemo(() => {
    const material = new LineMaterial({
      color: 'black',
      linewidth: 0.8,
      dashed: true,
    });
    material.resolution.set(window.innerWidth, window.innerHeight);
    return material;
  }, []);

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
          isAccessible={accessibleTiles.includes(tile.id)} // Resaltar si es accesible
          onClick={() => handleTileClick(tile)}
        />
      ))}

      {/* Renderiza el personaje */}
      <a.group position={springProps.position}>
        <Character characterType={selectedCharacter} />
      </a.group>
    </group>
  );
}