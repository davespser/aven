export const calculateAccessibleTiles = (mapSize, currentPosition, movementRange) => {
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