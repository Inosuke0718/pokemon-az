import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { BattlePokemon } from "./BattlePokemon";
import { useBattleStore } from "./battleStore";

export function BattleScene() {
  const { playerPokemon, opponentPokemon, phase, executeMove } =
    useBattleStore();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [5, 5, 10], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <BattlePokemon
          isPlayer={true}
          modelPath="/models/pikachu.glb"
          position={[-2, 0, 2]}
          rotation={[0, Math.PI / 4, 0]}
        />

        <BattlePokemon
          isPlayer={false}
          modelPath="/models/charizard.glb"
          position={[2, 0, -2]}
          rotation={[0, (-Math.PI / 4) * 3, 0]}
        />

        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Environment preset="park" />
        <OrbitControls />
      </Canvas>

      {/* Battle UI Overlay */}
      {phase === "player_choice" && playerPokemon && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {playerPokemon.moves.map((move) => (
            <button
              key={move.id}
              onClick={() => executeMove("player", move.id)}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                cursor: "pointer",
                background: "#f0f0f0",
                border: "none",
                borderRadius: "8px",
              }}
            >
              {move.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
