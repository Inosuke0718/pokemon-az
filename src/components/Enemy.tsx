import {
  RigidBody,
  RapierRigidBody,
  CapsuleCollider,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "../store";

type EnemyState = "IDLE" | "CHASE" | "ATTACK" | "COOLDOWN";

export const Enemy = ({ position }: { position: [number, number, number] }) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const playerRef = useGameStore((state) => state.playerRef);
  const [hp, setHp] = useState(100);
  const [state, setState] = useState<EnemyState>("IDLE");
  const lastAttackTime = useRef(0);
  const isDeadRef = useRef(false);

  // Constants
  const CHASE_RANGE = 10;
  const ATTACK_RANGE = 2;
  const MOVEMENT_SPEED = 4;
  const ATTACK_COOLDOWN = 2000;
  const DAMAGE_AMOUNT = 15;

  const decreasePlayerHealth = useGameStore(
    (state) => state.actions.decreasePlayerHealth,
  );

  useFrame(() => {
    if (isDeadRef.current) return;
    if (!rigidBody.current || !playerRef?.current) return;

    const enemyPos = rigidBody.current.translation();
    const playerPos = playerRef.current.translation();

    const dist = new THREE.Vector3(
      playerPos.x - enemyPos.x,
      0,
      playerPos.z - enemyPos.z,
    ).length();

    // State Machine
    switch (
      state // Using the state variable from useState
    ) {
      case "IDLE":
        if (dist < CHASE_RANGE) setState("CHASE");
        break;
      case "CHASE":
        if (dist > CHASE_RANGE * 1.5) {
          setState("IDLE");
          rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        } else if (dist < ATTACK_RANGE) {
          setState("ATTACK");
        } else {
          // Move towards player
          const dir = new THREE.Vector3(
            playerPos.x - enemyPos.x,
            0,
            playerPos.z - enemyPos.z,
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
        }
        break;
      case "ATTACK":
        // Perform attack (simple dash or hit)
        if (Date.now() - lastAttackTime.current > ATTACK_COOLDOWN) {
          console.log("Enemy Attacks!");
          lastAttackTime.current = Date.now();
          decreasePlayerHealth(DAMAGE_AMOUNT); // Deal damage
          setState("COOLDOWN");
        }
        break;
      case "COOLDOWN":
        if (Date.now() - lastAttackTime.current > 1000) {
          setState("CHASE");
        }
        break;
    }
  });

  // Handle taking damage
  const takeDamage = (amount: number) => {
    setHp((prev) => Math.max(0, prev - amount));
    rigidBody.current?.applyImpulse({ x: 0, y: 5, z: 0 }, true); // Knockback up
  };

  const capture = () => {
    isDeadRef.current = true;
    setHp(0); // Remove immediately on capture
  };

  if (hp <= 0) return null;

  return (
    <RigidBody
      ref={rigidBody}
      position={position}
      colliders={false}
      enabledRotations={[false, false, false]}
      userData={{ type: "enemy", takeDamage, capture }}
    >
      <CapsuleCollider args={[0.5, 0.5]} />

      {/* Visuals */}
      <group>
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 1, 4, 8]} />
          <meshStandardMaterial color={state === "ATTACK" ? "red" : "purple"} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.2, 0.5, 0.4]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.2, 0.5, 0.4]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>

      {/* HP Bar - 3D World UI */}
      <Html position={[0, 1.5, 0]}>
        <div style={{ width: "50px", height: "5px", background: "red" }}>
          <div
            style={{ width: `${hp}%`, height: "100%", background: "green" }}
          />
        </div>
      </Html>
    </RigidBody>
  );
};
