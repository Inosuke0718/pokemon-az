import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCharacterCustomization } from './CharacterCustomizationContext';

export const HumanModel = (props) => {
  const { characterConfig } = useCharacterCustomization();
  const group = useRef();

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Head Group */}
      <group position={[0, 1.6, 0]}>
        {/* Head Shape */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color={characterConfig.skinColor} />
        </mesh>
        
        {/* Hair (Simple Helmet) */}
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.13, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <meshStandardMaterial color={characterConfig.hairColor} />
        </mesh>

        {/* Eyes */}
        <group position={[0, 0.02, 0.1]}>
          <mesh position={[-0.04, 0, 0]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
      </group>

      {/* Body / Torso */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.15]} />
        <meshStandardMaterial color={characterConfig.shirtColor} />
      </mesh>

      {/* Arms */}
      <group position={[0, 1.4, 0]}>
        {/* Left Arm */}
        <mesh position={[-0.18, -0.25, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.05, 0.5, 8, 16]} />
          <meshStandardMaterial color={characterConfig.skinColor} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.18, -0.25, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.05, 0.5, 8, 16]} />
          <meshStandardMaterial color={characterConfig.skinColor} />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[0, 0.85, 0]}>
        {/* Left Leg */}
        <mesh position={[-0.08, -0.4, 0]}>
          <capsuleGeometry args={[0.06, 0.8, 8, 16]} />
          <meshStandardMaterial color={characterConfig.pantsColor} />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.08, -0.4, 0]}>
          <capsuleGeometry args={[0.06, 0.8, 8, 16]} />
          <meshStandardMaterial color={characterConfig.pantsColor} />
        </mesh>
      </group>

      {/* Shoes */}
      <group position={[0, 0, 0]}>
        {/* Left Shoe */}
        <mesh position={[-0.08, 0.05, 0.05]}>
          <boxGeometry args={[0.08, 0.1, 0.15]} />
          <meshStandardMaterial color={characterConfig.shoesColor} />
        </mesh>
        {/* Right Shoe */}
        <mesh position={[0.08, 0.05, 0.05]}>
          <boxGeometry args={[0.08, 0.1, 0.15]} />
          <meshStandardMaterial color={characterConfig.shoesColor} />
        </mesh>
      </group>
    </group>
  );
};
