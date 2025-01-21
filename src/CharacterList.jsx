import React from 'react';
import useCharacterStore from './store';

const CharacterList = () => {
  const characters = useCharacterStore((state) => state.characters);
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);
  const selectedCharacter = useCharacterStore((state) => state.selectedCharacter);

  return (
    <div>
      <h1>Personajes</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {characters.length > 0 ? (
          characters.map((character) => (
            <li
              key={character.id}
              style={{
                display: 'inline-block',
                margin: '10px',
                cursor: 'pointer',
                opacity: selectedCharacter === character.id ? 1 : 0.5,
              }}
              onClick={() => selectCharacter(character.id)}
            >
              <img
                src={character.image}
                alt={character.name}
                style={{
                  width: '100px',
                  height: '100px',
                  border: selectedCharacter === character.id ? '2px solid green' : 'none'
                }}
              />
              <p>{character.name}</p>
            </li>
          ))
        ) : (
          <p>No hay personajes disponibles.</p>
        )}
      </ul>
      {selectedCharacter && characters.find(c => c.id === selectedCharacter) ? (
        <div style={{ marginTop: '20px' }}>
          <h2>Personaje Seleccionado</h2>
          <p>
            ID: {selectedCharacter}
            <br />
            Nombre: {characters.find(c => c.id === selectedCharacter).name}
          </p>
          <p>
            Fuerza: {characters.find(c => c.id === selectedCharacter).stats.strength}
            <br />
            Agilidad: {characters.find(c => c.id === selectedCharacter).stats.agility}
          </p>
          <img 
            src={characters.find(c => c.id === selectedCharacter).image}
            alt={`Selected Character: ${characters.find(c => c.id === selectedCharacter).name}`}
            style={{ width: '150px', height: '150px' }}
          />
        </div>
      ) : (
        <p>No hay personaje seleccionado.</p>
      )}
    </div>
  );
};

export default CharacterList;