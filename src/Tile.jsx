import React, { useMemo } from 'react';
import { BoxGeometry, EdgesGeometry } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { a, useSpring } from '@react-spring/three';

export default function Tile({ position, material, lineMaterial, isSelected, isInRange, onClick }) {
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
        <meshPhysicalMaterial
          {...material}
          color={isSelected ? 'blue' : isInRange ? 'green' : material.color}
        />
      </mesh>
      <primitive object={edges} />
      {isSelected && (
        <spotLight position={[0, 5, 0]} angle={0.5} intensity={2} penumbra={0.5} castShadow />
      )}
    </a.group>
  );
}