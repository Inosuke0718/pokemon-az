import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  useRapier,
  CapsuleCollider,
} from "@react-three/rapier";
import { useRef, useState, forwardRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore } from "../store";

import { AttackEffect } from "./AttackEffect";
import { Pokeball } from "./Pokeball";
import { HumanoidModel } from "./HumanoidModel";

export const CONTROLS = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  jump: "jump",
  sprint: "sprint",
  throw: "throw",
  attack: "attack",
  togglePokemon: "togglePokemon",
};

export const Player = forwardRef<RapierRigidBody>((_, ref) => {
  const body = useRef<RapierRigidBody | null>(null);

  // Manual ref merging
  const setRef = (node: RapierRigidBody | null) => {
    body.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as any).current = node;
    }
  };

  // Sync ref with store for other components (AllyPokemon)
  useEffect(() => {
    if (body.current) {
      useGameStore.getState().actions.setPlayerRef(body);
    }
  }, []);

  const [, get] = useKeyboardControls();
  // Animation state (re-renders only on key change)
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const isWalking = forward || backward || left || right;

  const { rapier, world } = useRapier();
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 5, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  // Pokeball logic
  const [balls, setBalls] = useState<
    { id: number; position: THREE.Vector3; direction: THREE.Vector3 }[]
  >([]);
  const lastThrowTime = useRef(0);
  const lastToggleTimeRef = useRef(0);

  // Attack logic
  const [attacks, setAttacks] = useState<
    { id: number; position: THREE.Vector3; direction: THREE.Vector3 }[]
  >([]);
  const lastAttackTime = useRef(0);

  useFrame((state, delta) => {
    if (!body.current) return;

    const {
      forward,
      backward,
      left,
      right,
      jump,
      sprint,
      throw: throwBall,
      attack,
    } = get();

    // Stamina Logic (Access store directly to avoid re-renders)
    const { stamina } = useGameStore.getState().playerState;
    const { setStamina } = useGameStore.getState().actions;

    let currentSpeed = 6;

    if (sprint && (forward || backward || left || right) && stamina > 0) {
      currentSpeed = 10;
      setStamina(stamina - 20 * delta); // Drain stamina
    } else {
      if (stamina < 100) {
        setStamina(stamina + 10 * delta); // Regenerate stamina
      }
    }

    // 1. Movement Logic
    const velocity = body.current.linvel();
    const cameraDirection = new THREE.Vector3();
    state.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    const moveDirection = new THREE.Vector3();
    if (forward) moveDirection.add(cameraDirection);
    if (backward) moveDirection.sub(cameraDirection);
    if (left) moveDirection.sub(cameraRight);
    if (right) moveDirection.add(cameraRight);
    moveDirection.normalize();

    const speed = currentSpeed;
    const moveVector = moveDirection.multiplyScalar(speed);

    // Preserve Y velocity (gravity)
    body.current.setLinvel(
      {
        x: moveVector.x,
        y: velocity.y,
        z: moveVector.z,
      },
      true,
    );

    // Rotate character to face movement direction
    if (moveDirection.length() > 0.1) {
      const angle = Math.atan2(moveDirection.x, moveDirection.z);
      const rotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle,
      );
      body.current.setRotation(rotation, true);
    }

    // 2. Jump Logic
    if (jump) {
      const rayOrigin = body.current.translation();
      // Slightly offset ray start to avoid inside-body issues, cast downwards
      const rayDir = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(rayOrigin, rayDir);
      const hit = world.castRay(ray, 1.5, true); // 1.5 length to reach slightly below player

      // Only jump if close to ground (simple ground check)
      // Check if hit exists and distance is small enough
      if (hit && (hit as any).toi < 1.5) {
        body.current.setLinvel({ x: velocity.x, y: 8, z: velocity.z }, true);
      }
    }

    // 3. Throw Logic
    if (throwBall) {
      const now = Date.now();
      if (now - lastThrowTime.current > 500) {
        // 500ms cooldown
        lastThrowTime.current = now;

        const playerPos = body.current.translation();
        const throwPos = new THREE.Vector3(
          playerPos.x,
          playerPos.y + 1.5,
          playerPos.z,
        );

        // Throw direction matches camera direction (or character facing)
        const throwDir = new THREE.Vector3();
        state.camera.getWorldDirection(throwDir);
        throwDir.normalize();

        throwPos.add(throwDir.clone().multiplyScalar(1.0));

        setBalls((prev) => [
          ...prev,
          { id: now, position: throwPos, direction: throwDir },
        ]);
      }
    }

    // 4. Attack Logic (Key G)
    if (attack) {
      const now = Date.now();
      if (now - lastAttackTime.current > 1000) {
        // 1s cooldown
        lastAttackTime.current = now;

        const playerPos = body.current.translation();
        const attackPos = new THREE.Vector3(
          playerPos.x,
          playerPos.y + 1,
          playerPos.z,
        );

        const attackDir = new THREE.Vector3();
        state.camera.getWorldDirection(attackDir);
        attackDir.normalize();
        attackPos.add(attackDir.clone().multiplyScalar(1.0));

        setAttacks((prev) => [
          ...prev,
          { id: now, position: attackPos, direction: attackDir },
        ]);
      }
    }

    // 5. Toggle Pokemon Logic (Key R)
    const { togglePokemon } = get();
    if (togglePokemon) {
      const now = Date.now();
      // Use lastThrowTime as generic cooldown or create new one
      // Let's reuse lastThrowTime for simplicity or better, create `lastToggleTime`
      if (now - (lastToggleTimeRef.current || 0) > 500) {
        lastToggleTimeRef.current = now;

        const state = useGameStore.getState();
        const currentId = state.activePokemonId;
        const pokemons = state.inventory.pokemons;

        if (currentId) {
          console.log("De-activating pokemon");
          state.actions.setActivePokemon(null);
        } else if (pokemons.length > 0) {
          console.log("Activating pokemon:", pokemons[0].name);
          state.actions.setActivePokemon(pokemons[0].id);
        }
      }
    }

    // 6. Camera Follow Logic
    const playerPos = body.current.translation();
    const cameraOffset = new THREE.Vector3(0, 3, 6); // Behind and slightly up

    // Ideal camera position based on player position
    const targetCameraPos = new THREE.Vector3(
      playerPos.x + cameraOffset.x,
      playerPos.y + cameraOffset.y,
      playerPos.z + cameraOffset.z,
    );

    // Smooth camera movement
    smoothedCameraPosition.lerp(targetCameraPos, 5 * delta);
    state.camera.position.copy(smoothedCameraPosition);

    // Smooth look-at
    const targetLookAt = new THREE.Vector3(
      playerPos.x,
      playerPos.y + 1,
      playerPos.z,
    );
    smoothedCameraTarget.lerp(targetLookAt, 10 * delta);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <>
      <RigidBody
        ref={setRef}
        colliders={false} // Use explicit collider below
        enabledRotations={[false, false, false]}
        position={[10, 5, 10]}
        friction={1}
        userData={{ type: "player", ref: body }} // Expose ref for enemies if needed, though usually pass via context/hooks
      >
        <CapsuleCollider args={[0.5, 0.5]} />

        {/* Visual Model */}
        <group position={[0, -1, 0]}>
          <HumanoidModel isWalking={!!isWalking} />
        </group>
      </RigidBody>

      {/* Render Active Pokeballs */}
      {balls.map((ball) => (
        <Pokeball
          key={ball.id}
          startPosition={ball.position}
          direction={ball.direction}
          onRemove={() =>
            setBalls((prev) => prev.filter((b) => b.id !== ball.id))
          }
        />
      ))}

      {/* Render Active Attacks */}
      {attacks.map((attack) => (
        <AttackEffect
          key={attack.id}
          startPosition={attack.position}
          direction={attack.direction}
          onComplete={() =>
            setAttacks((prev) => prev.filter((a) => a.id !== attack.id))
          }
        />
      ))}
    </>
  );
});
