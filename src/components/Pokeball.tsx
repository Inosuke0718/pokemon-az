import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Sphere } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store";

interface PokeballProps {
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
  force?: number;
  onCollision?: () => void;
  onRemove?: () => void;
}

export const Pokeball = ({
  startPosition,
  direction,
  force = 20,
  onCollision,
  onRemove,
}: PokeballProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const addPokemon = useGameStore((state) => state.actions.addPokemon);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureScale, setCaptureScale] = useState(1);

  useEffect(() => {
    if (rigidBodyRef.current) {
      // Apply initial impulse
      const impulse = direction.clone().multiplyScalar(force);
      // Add slightly upward arc
      impulse.y += force * 0.2;
      rigidBodyRef.current.applyImpulse(impulse, true);

      // Add spin (torque)
      rigidBodyRef.current.applyTorqueImpulse(
        { x: Math.random(), y: Math.random(), z: Math.random() },
        true,
      );
    }

    const timer = setTimeout(() => {
      onRemove?.();
    }, 5000); // multiple balls can exist, cleanup

    return () => clearTimeout(timer);
  }, [onRemove]);

  const handleCollision = ({
    other,
  }: {
    other: { rigidBodyObject?: THREE.Object3D; rigidBody?: RapierRigidBody };
  }) => {
    // Check if we hit a pokemon
    // We assume the target RigidBody has userData={{ type: 'pokemon' }}
    // In React Three Rapier, the userData is often on the rigidBodyObject

    // Note: The structure of 'other' might vary depending on R3F version,
    // usually other.rigidBodyObject.userData or other.userData

    const userData = other.rigidBodyObject?.userData as any;

    if (
      !isCapturing &&
      userData &&
      (userData.type === "pokemon" || userData.type === "enemy")
    ) {
      console.log("Hit Pokemon!");
      setIsCapturing(true);
      // Basic capture logic: 50% chance
      if (Math.random() > 0.5) {
        console.log("Caught!");
        addPokemon({
          id: Math.random().toString(36).substr(2, 9),
          speciesId: 25, // Pikachu placeholder
          name: "Wild Pokemon",
          level: 5,
          caughtAt: new Date(),
        });

        // Remove the enemy from the world
        // Defer removal to next tick to avoid Rapier unsafe aliasing error during collision callback
        if (userData && userData.capture) {
          setTimeout(() => {
            userData.capture();
          }, 0);
        }
      } else {
        console.log("Escaped!");
      }

      // Trigger generic collision callback
      onCollision?.();

      // Stop the ball
      // rigidBodyRef.current?.setLinvel({x:0, y:0, z:0}, true);
    }
  };

  useFrame((_, delta) => {
    if (isCapturing) {
      // Animate capture (pulsing red or something)
      // For now, just cleanup faster
      if (captureScale > 0) {
        setCaptureScale((prev) => Math.max(0, prev - delta * 5));
      } else {
        onRemove?.();
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={startPosition}
      colliders="ball"
      restitution={0.7}
      friction={0.5}
      onCollisionEnter={handleCollision}
      userData={{ type: "pokeball" }}
    >
      <Sphere args={[0.2]} scale={captureScale}>
        <meshStandardMaterial
          color={isCapturing ? "red" : "white"}
          emissive={isCapturing ? "red" : "black"}
        />
      </Sphere>
      {/* Top half (red) and bottom half (white) visualization could be improved later */}
      <group scale={captureScale}>
        {/* Simple visualization: Red Top */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry
            args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Black Band */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.02, 16, 32]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* Button */}
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </RigidBody>
  );
};
