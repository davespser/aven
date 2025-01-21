import {create} from 'zustand';

const useCharacterStore = create((set) => ({
  characters: [
    { id: 'yopuka', name: 'Yopuka', stats: { strength: 10, agility: 5 }, image: './models/faceyopuka.png' },
    { id: 'pandawa', name: 'Pandawa', stats: { strength: 7, agility: 8 }, image: './models/facewa.png' },
  ], // Lista inicial de personajes con imágenes
  selectedCharacter: null, // ID o referencia del personaje seleccionado

  // Acción para seleccionar un personaje
  selectCharacter: (id) => set({ selectedCharacter: id }),

  // Acción para agregar un personaje (si necesitas más en el futuro)
  addCharacter: (character) => set((state) => ({
    characters: [...state.characters, character],
  })),

  // Acción para eliminar un personaje
  removeCharacter: (id) => set((state) => ({
    characters: state.characters.filter((char) => char.id !== id),
    selectedCharacter: state.selectedCharacter === id ? null : state.selectedCharacter,
  })),

  // Acción para reiniciar la selección
  clearSelection: () => set({ selectedCharacter: null }),

  // Acción para actualizar la imagen de un personaje
  updateCharacterImage: (id, newImagePath) => set((state) => ({
    characters: state.characters.map(char => 
      char.id === id ? { ...char, image: newImagePath } : char
    )
  })),
}));

export default useCharacterStore;