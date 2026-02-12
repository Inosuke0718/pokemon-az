import React from 'react';
import { Stack, ColorInput, Group, Button, Text, Title, Paper } from '@mantine/core';
import { IconCamera, IconDeviceFloppy } from '@tabler/icons-react';
import { useCharacterCustomization } from './CharacterCustomizationContext';

export const ConfiguratorInterface = () => {
  const { characterConfig, updateConfig, setCameraMode } = useCharacterCustomization();

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* Top Right: Camera Controls */}
      <Paper shadow="xs" p="xs" style={{ position: 'absolute', top: 20, right: 20, pointerEvents: 'auto' }}>
        <Group>
          <Button variant={characterConfig.cameraMode === 'FREE' ? 'filled' : 'light'} onClick={() => setCameraMode('FREE')}>Free</Button>
          <Button variant={characterConfig.cameraMode === 'HEAD' ? 'filled' : 'light'} onClick={() => setCameraMode('HEAD')}>Head</Button>
          <Button variant={characterConfig.cameraMode === 'TOP' ? 'filled' : 'light'} onClick={() => setCameraMode('TOP')}>Body</Button>
          <Button variant={characterConfig.cameraMode === 'BOTTOM' ? 'filled' : 'light'} onClick={() => setCameraMode('BOTTOM')}>Legs</Button>
        </Group>
      </Paper>

      {/* Left Panel: Customization Options */}
      <Paper shadow="md" p="md" style={{ position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)', width: 300, pointerEvents: 'auto' }}>
        <Stack>
          <Title order={3}>Character Creator</Title>
          
          <Text size="sm" active>Body Properties</Text>
          <ColorInput 
            label="Skin Color" 
            value={characterConfig.skinColor} 
            onChange={(c) => updateConfig('skinColor', c)} 
          />
          <ColorInput 
            label="Hair Color" 
            value={characterConfig.hairColor} 
            onChange={(c) => updateConfig('hairColor', c)} 
          />

          <Text size="sm" mt="md">Clothing</Text>
          <ColorInput 
            label="Shirt Color" 
            value={characterConfig.shirtColor} 
            onChange={(c) => updateConfig('shirtColor', c)} 
          />
          <ColorInput 
            label="Pants Color" 
            value={characterConfig.pantsColor} 
            onChange={(c) => updateConfig('pantsColor', c)} 
          />
          <ColorInput 
            label="Shoes Color" 
            value={characterConfig.shoesColor} 
            onChange={(c) => updateConfig('shoesColor', c)} 
          />
        </Stack>
      </Paper>

      {/* Bottom Center: Action Button */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto' }}>
        <Button 
          size="lg" 
          leftSection={<IconDeviceFloppy size={20} />}
          onClick={() => alert(JSON.stringify(characterConfig, null, 2))}
        >
          Save Character
        </Button>
      </div>
    </div>
  );
};
