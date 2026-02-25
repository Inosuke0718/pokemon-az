import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  RigidBody,
  RapierRigidBody,
  CapsuleCollider,
} from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore, Pokemon } from "../store";

interface AllyPokemonProps {
  pokemon: Pokemon;
  position: THREE.Vector3;
}

export const AllyPokemon = ({ pokemon, position }: AllyPokemonProps) => {
  console.log("AllyPokemon: Rendering", pokemon.name, position);
  const rigidBody = useRef<RapierRigidBody>(null);
  const playerRef = useGameStore((state) => state.playerRef);
  const [state, setState] = useState<"IDLE" | "FOLLOW">("IDLE");

  // Debug mount
  useState(() => {
    console.log("AllyPokemon: Mounted");
  });

  // Constants
  const FOLLOW_DISTANCE = 3;
  const STOP_DISTANCE = 2;
  const MOVEMENT_SPEED = 5;

  useFrame(() => {
    if (!rigidBody.current || !playerRef?.current) return;

    const myPos = rigidBody.current.translation();
    const playerPos = playerRef.current.translation();

    const dist = new THREE.Vector3(
      playerPos.x - myPos.x,
      0,
      playerPos.z - myPos.z,
    ).length();

    if (dist > FOLLOW_DISTANCE) {
      setState("FOLLOW");
    } else if (dist < STOP_DISTANCE) {
      setState("IDLE");
    }

    if (state === "FOLLOW") {
      // Move towards player
      const dir = new THREE.Vector3(
        playerPos.x - myPos.x,
        0,
        playerPos.z - myPos.z,
      ).normalize();

      rigidBody.current.setLinvel(
        {
          x: dir.x * MOVEMENT_SPEED,
          y: rigidBody.current.linvel().y,
          z: dir.z * MOVEMENT_SPEED,
        },
        true,
      );

      // Look at player
      const angle = Math.atan2(dir.x, dir.z);
      const rotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle,
      );
      rigidBody.current.setRotation(rotation, true);
    } else {
      // Stop
      rigidBody.current.setLinvel(
        { x: 0, y: rigidBody.current.linvel().y, z: 0 },
        true,
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      position={position}
      colliders={false}
      enabledRotations={[false, false, false]}
      userData={{ type: "ally" }}
    >
      <CapsuleCollider args={[0.4, 0.4]} />

      {/* Visuals - Pikachu-ish */}
      <group>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="yellow" />
        </mesh>

        {/* Ears */}
        <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
        <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="yellow" />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Cheeks */}
        <mesh position={[0.25, -0.05, 0.3]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[-0.25, -0.05, 0.3]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
      {/* HP Bar / Name - 3D World UI */}
      <Html position={[0, 0.8, 0]}>
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            color: "white",
            padding: "2px 4px",
            borderRadius: "4px",
            fontSize: "10px",
            whiteSpace: "nowrap",
          }}
        >
          {pokemon.name} Lv.{pokemon.level}
        </div>
      </Html>
    </RigidBody>
  );
};
