import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { BoxGeometry, EdgesGeometry } from 'three';
import { a, useSpring } from '@react-spring/three';
import Character from './character'; // Componente del personaje

function Tile({ position, material, lineMaterial, isSelected, isInPath, onPointerEnter, onClick }) {
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
    <a.group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerEnter={onPointerEnter} // Detecta cuando el mouse pasa sobre el tile
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshPhysicalMaterial
          {...material}
          color={isSelected ? 'blue' : isInPath ? 'yellow' : material.color}
        />
      </mesh>
      <primitive object={edges} />
    </a.group>
  );
}

export default function TiledMap1({ selectedCharacter }) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [accessibleTiles, setAccessibleTiles] = useState([]); // Tiles disponibles para movimiento
  const [pathTiles, setPathTiles] = useState([]); // Tiles del camino seleccionado
  const [isDragging, setIsDragging] = useState(false); // Estado de arrastre
  const mapSize = 10;
  const movementRange = 3;

  const [characterPosition, setCharacterPosition] = useState([0, 0.5, 0]);
  const [springProps, api] = useSpring(() => ({
    position: characterPosition,
    config: { tension: 200, friction: 25 },
  }));

  const calculateAccessibleTiles = (currentPosition) => {
    const [currentX, currentZ] = currentPosition;
    const rangeTiles = [];

    for (let x = 0; x < mapSize; x++) {
      for (let z = 0; z < mapSize; z++) {
        const distance = Math.abs(x - currentX) + Math.abs(z - currentZ);
        if (distance <= movementRange) {
          rangeTiles.push(`${x}-${z}`);
        }
      }
    }
    return rangeTiles;
  };

  const handleCharacterClick = () => {
    const [currentX, , currentZ] = characterPosition.map((coord) => Math.round(coord + mapSize / 2));
    const accessible = calculateAccessibleTiles([currentX, currentZ]);
    setAccessibleTiles(accessible);
  };

  const handleTileClick = (tile) => {
    if (!accessibleTiles.includes(tile.id)) return;

    const [x, z] = tile.id.split('-').map(Number);
    setSelectedTile(tile.id);
    const newPosition = [x - mapSize / 2, 0.5, z - mapSize / 2];
    setCharacterPosition(newPosition);
    api.start({ position: newPosition });
    setAccessibleTiles([]);
  };

  const handlePointerDown = () => {
    setIsDragging(true);
    setPathTiles([]); // Limpia el camino al iniciar
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    moveCharacterThroughPath(); // Mueve el personaje por el camino seleccionado
    setPathTiles([]); // Limpia los tiles seleccionados al terminar el movimiento
  };

  const handlePointerEnter = (tile) => {
    if (isDragging && accessibleTiles.includes(tile.id) && !pathTiles.includes(tile.id)) {
      setPathTiles((prev) => [...prev, tile.id]); // Agrega el tile al camino si está dentro del rango
    }
  };

  const moveCharacterThroughPath = () => {
    if (pathTiles.length === 0) return;

    // Convierte los IDs a posiciones reales y anima al personaje
    const pathPositions = pathTiles.map((id) => {
      const [x, z] = id.split('-').map(Number);
      return [x - mapSize / 2, 0.5, z - mapSize / 2];
    });

    let delay = 0;
    pathPositions.forEach((position, index) => {
      setTimeout(() => {
        api.start({ position });
        if (index === pathPositions.length - 1) {
          setCharacterPosition(position); // Actualiza la posición final del personaje
        }
      }, delay);
      delay += 500; // Agrega un retraso para que el personaje se mueva por cada tile
    });
  };

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

  const lineMaterial = useMemo(() => {
    const material = new LineMaterial({
      color: 'black',
      linewidth: 0.8,
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
    <group
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          {...tile}
          isSelected={selectedTile === tile.id}
          isInPath={pathTiles.includes(tile.id)}
          onPointerEnter={() => handlePointerEnter(tile)}
          onClick={() => handleTileClick(tile)}
        />
      ))}

      {/* Renderiza el personaje */}
      <a.group position={springProps.position} onClick={handleCharacterClick}>
        <Character characterType={selectedCharacter} />
      </a.group>
    </group>
  );
}