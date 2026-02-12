import React, { useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { CharacterCustomizationProvider, CharacterCustomizationContext, useCharacterCustomization } from './CharacterCustomizationContext'; // Ensure Context is exported
import { HumanModel } from './HumanModel';
import { ConfiguratorInterface } from './ConfiguratorInterface';
import { CameraController } from './CameraController'; // Separated for cleanliness, or defined here

// --- Internal Components defined here for simplicity in the example ---

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CameraControllerComponent = () => {
  const { characterConfig, updateConfig } = useCharacterCustomization();
  const controls = useRef();
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (characterConfig.cameraMode === 'FREE') return;

    let targetPos = new THREE.Vector3(0, 1, 3); // Default
    let targetLook = new THREE.Vector3(0, 1, 0);

    switch (characterConfig.cameraMode) {
      case 'HEAD':
        targetPos.set(0, 1.7, 1.0);
        targetLook.set(0, 1.6, 0); // Focus on head
        break;
      case 'TOP':
        targetPos.set(0, 1.3, 1.5); // Focus on torso
        targetLook.set(0, 1.2, 0);
        break;
      case 'BOTTOM':
        targetPos.set(0, 0.5, 1.5); // Focus on legs
        targetLook.set(0, 0.5, 0);
        break;
      default:
        break;
    }

    // Smooth transition
    state.camera.position.lerp(targetPos, delta * 2);
    if (controls.current) {
        controls.current.target.lerp(targetLook, delta * 2);
        controls.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controls} 
      makeDefault 
      onStart={() => updateConfig('cameraMode', 'FREE')} 
    />
  );
};

const SceneContent = () => {
    return (
        <>
            <color attach="background" args={['#202025']} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Environment preset="city" />
            
            <group position={[0, -1, 0]}>
                <HumanModel />
                <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={1} color="#000000" />
            </group>

            <CameraControllerComponent />
        </>
    )
}

const CharacterCreatorInner = () => {
    const contextValue = useContext(CharacterCustomizationContext);
    
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
            {/* Bridge Context to R3F */}
            <CharacterCustomizationContext.Provider value={contextValue}>
                <SceneContent />
            </CharacterCustomizationContext.Provider>
        </Canvas>
        <ConfiguratorInterface />
        </div>
    );
};

export const CharacterCreatorScene = () => {
  return (
    <CharacterCustomizationProvider>
      <CharacterCreatorInner />
    </CharacterCustomizationProvider>
  );
};
