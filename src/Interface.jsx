import React, { useState, useMemo, useEffect } from 'react';

export default function Interface({ onSelectCharacter }) {
  const [selectedImage, setSelectedImage] = useState('./models/facewa.png'); // Imagen inicial
  const [showOptions, setShowOptions] = useState(false); // Controla si se muestran las opciones
  const [imageError, setImageError] = useState(false); // Estado para manejar errores de carga de imagen

  // Usando useMemo para memorizar la lista de personajes
  const characters = useMemo(() => [
    { name: 'Xina', image: './models/facewa.png', model: 'pandawa' },
    { name: 'Yopuka', image: './models/faceyopuka.png', model: 'yopuka' },
  ], []);

  const handleSelect = (character) => {
    console.log('Character Selected:', character);
    
    if (!character) {
      console.error('Error: character is undefined or null');
      return;
    }
    
    console.log('Character Image:', character.image);
    setSelectedImage(character.image); // Cambia la imagen seleccionada
    console.log('New Selected Image:', character.image); // Corregido para mostrar la nueva imagen seleccionada
    
    setShowOptions(false); // Oculta las opciones
    setImageError(false); // Resetea el estado de error cuando se selecciona un nuevo personaje
    
    if (typeof onSelectCharacter === 'function') {
      console.log('Calling onSelectCharacter with:', character.model);
      onSelectCharacter(character.model); // Notifica al sistema el personaje seleccionado
    } else {
      console.error('Error: onSelectCharacter is not a function');
    }
  };

  // Buscar el personaje seleccionado usando el estado actual de selectedImage
  const safeImage = selectedImage || './models/placeholder.png'; // Asegura que siempre haya una imagen válida
  const selectedCharacter = (characters || []).find((c) => c.image === selectedImage) || { name: 'Unknown', image: '' };

  useEffect(() => {
    console.log('Current State:', { selectedImage, selectedCharacter, characters, showOptions });
  }, [selectedImage, selectedCharacter, characters, showOptions]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          padding: '10px',
          display: 'flex',
          gap: '10px',
        }}
      >
        {/* Contenedor principal */}
        {selectedCharacter && (
          <div
            style={{
              width: '80px',
              height: '160px',
              backgroundColor: 'black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 5px',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
            onClick={() => {
              console.log('Toggling showOptions');
              setShowOptions(!showOptions);
            }}
          >
            {/* Imagen seleccionada */}
            {!imageError ? (
              <img
                src={safeImage}
                alt={selectedCharacter.name}
                onError={(e) => {
                  console.error(`Error loading image: ${e.target.src}`);
                  e.target.src = './models/placeholder.png';
                  setImageError(true);
                }}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '2px solid blue',
                }}
              />
            ) : (
              <div 
                style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  border: '2px solid red', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: 'lightgray'
                }}
              >
                Error
              </div>
            )}
            {/* Nombre del personaje */}
            <div
              style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {selectedCharacter.name}
            </div>
            {/* Barra de vida */}
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'darkblue',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: safeImage.includes('facewa') ? '70%' : '50%',
                  height: '100%',
                  backgroundColor: 'blue',
                }}
              />
            </div>
          </div>
        )}

        {/* Opciones adicionales */}
        {showOptions && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            {(characters || []).filter((c) => c.image !== selectedImage).map((character, index) => (
              <div
                key={character.image} // Usamos una clave más única
                style={{
                  width: '80px',
                  height: '160px',
                  backgroundColor: 'black',
                   
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 5px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  console.log('Character Option Clicked:', character);
                  handleSelect(character);
                }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  onError={(e) => {
                    console.error(`Error loading option image: ${e.target.src}`);
                    e.target.src = './models/placeholder.png'; // Imagen por defecto en caso de error
                  }}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: '2px solid gray',
                  }}
                />
                <div
                  style={{
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {character.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contenedor de rombos fuera del contenedor del personaje */}
      <div
  style={{
    position: 'absolute',
    top: '200px',
    left: '10px',
    width: '100px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotate(40deg)',
  }}
>
  {[
    { value: '*', x: 0, y: -10 },
    { value: '*', x: 10, y: 20 },
    { value: '*', x: -15, y: 40, central: true },
    { value: '*', x:-25, y: 10 },
    
  ].map((hex, i) => (
    <div
      key={`hexagon-${i}`}
      style={{
        position: 'absolute',
        top: `${hex.y}px`,
        left: `${hex.x}px`,
        width: hex.central ? '35px' : '35px',
        height: hex.central ? '35px' : '35px',
        backgroundColor: hex.central ? 'dimgray' : 'dimgray',
        clipPath:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        display: 'flex',
        borderRadius: hex.central ? '50%': '50%',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'gray',
        fontWeight: 'bold',
        fontSize: hex.central ? '14px' : '12px',
        transform: 'rotate(-40deg)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0',
          clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'darkgray',
          borderRadius: '50%', // Curvatura interna
          transform: 'scale(0.85)', // Ajustar escala para simular borde curvo
          zIndex: -1,
        }}
      ></div>
      {hex.value}
    </div>
  ))}
</div>
    </>
  );
}