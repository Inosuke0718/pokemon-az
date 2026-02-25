import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  RapierRigidBody,
  CapsuleCollider,
} from "@react-three/rapier";
import * as THREE from "three";

interface AttackProps {
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
  onComplete: () => void;
}

export const AttackEffect = ({
  startPosition,
  direction,
  onComplete,
}: AttackProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [hasHit, setHasHit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onComplete, 500); // 0.5s duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  useFrame((_, delta) => {
    if (rigidBodyRef.current) {
      const currentPos = rigidBodyRef.current.translation();
      const move = direction.clone().multiplyScalar(10 * delta);
      rigidBodyRef.current.setNextKinematicTranslation({
        x: currentPos.x + move.x,
        y: currentPos.y + move.y,
        z: currentPos.z + move.z,
      });
    }
  });

  const handleCollision = ({
    other,
  }: {
    other: { rigidBodyObject?: THREE.Object3D };
  }) => {
    if (hasHit) return;

    const userData = other.rigidBodyObject?.userData as any;

    if (
      userData &&
      (userData.type === "enemy" || userData.type === "pokemon")
    ) {
      console.log("Attack hit enemy!");
      if (userData.takeDamage) {
        userData.takeDamage(25); // Deal 25 damage
      }
      setHasHit(true);
      onComplete(); // Destroy projectile immediately on hit
    }
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={startPosition}
      type="kinematicPosition"
      sensor
      onIntersectionEnter={handleCollision}
    >
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="yellow" transparent opacity={0.8} />
      </mesh>
      <CapsuleCollider args={[0.3, 0.5]} rotation={[Math.PI / 2, 0, 0]} />
    </RigidBody>
  );
};
