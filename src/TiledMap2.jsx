import { useMemo } from 'react';
import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { BoxGeometry, EdgesGeometry } from 'three';

function Tile({ position, material, lineMaterial }) {
  const edges = useMemo(() => {
    const geometry = new BoxGeometry(1, 0.2, 1);
    const edgesGeometry = new EdgesGeometry(geometry);
    const lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeometry);
    return new LineSegments2(lineSegmentsGeometry, lineMaterial);
  }, [lineMaterial]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>
      <primitive object={edges} />
    </group>
  );
}

export default function TiledMap2() {
  const mapSize = 11;

  const iceMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#0b3f4d',
      transparent: false, // Sin transparencia
      opacity: 1,         // Totalmente opaco
      transmission: 0,     // Sin transmisión de luz
      roughness: 1,
      metalness: 0.1,
      clearcoat: 0,
      clearcoatRoughness: 1,
    });
  }, []);

  const lineMaterial = useMemo(() => {
    const material = new LineMaterial({
      color: 'grey',
      linewidth: 0,
      dashed: false,
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
        });
      }
    }
    return tileArray;
  }, [iceMaterial, lineMaterial]);

  return (
    <group>
      {tiles.map((tile, index) => (
        <Tile key={index} {...tile} />
      ))}
    </group>
  );
}