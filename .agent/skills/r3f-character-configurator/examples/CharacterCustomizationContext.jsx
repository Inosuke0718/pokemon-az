import { createContext, useContext, useState } from 'react';

const CharacterCustomizationContext = createContext({});

export const CharacterCustomizationProvider = ({ children }) => {
  const [characterConfig, setCharacterConfig] = useState({
    hairColor: '#333333',
    skinColor: '#f5c6a5',
    shirtColor: '#ff0000',
    pantsColor: '#0000ff',
    shoesColor: '#1a1a1a',
    cameraMode: 'FREE', // FREE, HEAD, TOP, BOTTOM
  });

  const updateConfig = (key, value) => {
    setCharacterConfig((prev) => ({ ...prev, [key]: value }));
  };

  const setCameraMode = (mode) => {
    updateConfig('cameraMode', mode);
  };

  return (
    <CharacterCustomizationContext.Provider
      value={{
        characterConfig,
        updateConfig,
        setCameraMode,
      }}
    >
      {children}
    </CharacterCustomizationContext.Provider>
  );
};

export const useCharacterCustomization = () => {
  return useContext(CharacterCustomizationContext);
};
