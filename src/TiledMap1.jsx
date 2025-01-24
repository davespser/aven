import React, { useState, useMemo } from 'react';
import { a, useSpring } from '@react-spring/three';
import Tile from './Tile';
import Character from './character';
import { calculateAccessibleTiles } from './TileMapUtils';
import { createIceMaterial, createLineMaterial } from './Materials';

export default function TiledMap1({ selectedCharacter }) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [accessibleTiles, setAccessibleTiles] = useState([]);
  const mapSize = 10;
  const movementRange = 3;

  const [characterPosition, setCharacterPosition] = useState([0, 0.5, 0]);
  const [springProps, api] = useSpring(() => ({
    position: characterPosition,
    config: { tension: 200, friction: 25 },
  }));

  const iceMaterial = useMemo(() => createIceMaterial(), []);
  const lineMaterial = useMemo(() => createLineMaterial(), []);

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

  const handleCharacterClick = () => {
    const [currentX, , currentZ] = characterPosition.map((coord) => Math.round(coord + mapSize / 2));
    const accessible = calculateAccessibleTiles(mapSize, [currentX, currentZ], movementRange);
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

  return (
    <group>
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          {...tile}
          isSelected={selectedTile === tile.id}
          isInRange={accessibleTiles.includes(tile.id)}
          onClick={() => handleTileClick(tile)}
        />
      ))}

      <a.group position={springProps.position} onClick={handleCharacterClick}>
        <Character characterType={selectedCharacter} />
      </a.group>
    </group>
  );
}