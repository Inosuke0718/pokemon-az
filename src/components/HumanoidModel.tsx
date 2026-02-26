import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HumanoidModelProps {
  color?: string;
  isWalking?: boolean;
}

export const HumanoidModel = ({
  color = "#00BFFF",
  isWalking = false,
}: HumanoidModelProps) => {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (
      isWalking &&
      leftLeg.current &&
      rightLeg.current &&
      leftArm.current &&
      rightArm.current
    ) {
      const time = state.clock.getElapsedTime();
      const speed = 10;
      const angle = Math.sin(time * speed) * 0.5;

      leftLeg.current.rotation.x = angle;
      rightLeg.current.rotation.x = -angle;

      leftArm.current.rotation.x = -angle;
      rightArm.current.rotation.x = angle;
    } else if (
      leftLeg.current &&
      rightLeg.current &&
      leftArm.current &&
      rightArm.current
    ) {
      // Reset pose
      leftLeg.current.rotation.x = 0;
      rightLeg.current.rotation.x = 0;
      leftArm.current.rotation.x = 0;
      rightArm.current.rotation.x = 0;
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#fcd5b5" />
      </mesh>
      {/* Hat */}
      <mesh position={[0, 1.76, 0]} castShadow>
        <boxGeometry args={[0.32, 0.1, 0.32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[0, 1.76, 0.15]} castShadow>
        <boxGeometry args={[0.32, 0.05, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arms */}
      <group position={[-0.25, 1.35, 0]}>
        <mesh ref={leftArm} position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      <group position={[0.25, 1.35, 0]}>
        <mesh ref={rightArm} position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.1, 0.85, 0]}>
        <mesh ref={leftLeg} position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      <group position={[0.1, 0.85, 0]}>
        <mesh ref={rightLeg} position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  );
};
