import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF, useAnimations } from "@react-three/drei";
import { useBattleStore } from "./battleStore";
import type { Group } from "three";

interface BattlePokemonProps {
  isPlayer: boolean;
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export function BattlePokemon({
  isPlayer,
  modelPath,
  position,
  rotation,
}: BattlePokemonProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  const pokemon = useBattleStore((state) =>
    isPlayer ? state.playerPokemon : state.opponentPokemon,
  );
  const phase = useBattleStore((state) => state.phase);

  // Animation logic
  useEffect(() => {
    if (!actions) return;

    const idleAnim = actions["Idle"];
    const attackAnim = actions["Attack"];
    const hitAnim = actions["Hit"];

    idleAnim?.reset().fadeIn(0.5).play();

    if (phase === "execution") {
      // Trigger attack animation based on event (simplified)
      // In a real app, listen to specific action events
    }

    return () => {
      actions["Idle"]?.fadeOut(0.5);
    };
  }, [actions, phase]);

  if (!pokemon) return null;

  return (
    <group ref={group} position={position} rotation={rotation} dispose={null}>
      <primitive object={scene} />

      {/* HP Bar Overlay */}
      <Html position={[0, 2, 0]} center>
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            padding: "4px",
            borderRadius: "4px",
            color: "white",
            width: "100px",
          }}
        >
          <div style={{ fontSize: "12px" }}>{pokemon.name}</div>
          <div
            style={{
              height: "4px",
              background: "#333",
              marginTop: "2px",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(pokemon.hp / pokemon.maxHp) * 100}%`,
                background:
                  pokemon.hp > pokemon.maxHp * 0.5 ? "#4caf50" : "#f44336",
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
          <div style={{ fontSize: "10px", textAlign: "right" }}>
            {pokemon.hp}/{pokemon.maxHp}
          </div>
        </div>
      </Html>
    </group>
  );
}
