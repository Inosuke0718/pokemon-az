import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { AllyPokemon } from "./components/AllyPokemon";
import {
  Environment,
  SoftShadows,
  Grid,
  KeyboardControls,
} from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { CONTROLS, Player } from "./components/Player";
import { WorldManager } from "./components/world/WorldManager";
import { useGameStore } from "./store";

function Scene() {
  const [playerBody, setPlayerBody] = useState<RapierRigidBody | null>(null);

  const { activePokemonId, inventory } = useGameStore((state) => ({
    activePokemonId: state.activePokemonId,
    inventory: state.inventory,
  }));

  const activePokemon = useMemo(
    () => inventory.pokemons.find((p) => p.id === activePokemonId),
    [activePokemonId, inventory.pokemons],
  );

  // Debug log for render
  if (activePokemon) {
    console.log(
      "Scene: Active Pokemon exists:",
      activePokemon.name,
      "PlayerBody:",
      playerBody ? "Valid" : "Null",
    );
  }

  return (
    <Physics debug>
      <WorldManager />
      <Player ref={setPlayerBody} />
      {activePokemon && playerBody && (
        <AllyPokemon
          key={activePokemon.id}
          pokemon={activePokemon}
          position={
            new THREE.Vector3(
              playerBody.translation().x,
              playerBody.translation().y + 5,
              playerBody.translation().z - 2,
            )
          }
        />
      )}
    </Physics>
  );
}

import { HUD } from "./components/HUD";

// ... (other imports)

function App() {
  const map = [
    { name: CONTROLS.forward, keys: ["ArrowUp", "KeyW"] },
    { name: CONTROLS.backward, keys: ["ArrowDown", "KeyS"] },
    { name: CONTROLS.left, keys: ["ArrowLeft", "KeyA"] },
    { name: CONTROLS.right, keys: ["ArrowRight", "KeyD"] },
    { name: CONTROLS.jump, keys: ["Space"] },
    { name: CONTROLS.sprint, keys: ["Shift"] },
    { name: CONTROLS.throw, keys: ["KeyF"] },
    { name: CONTROLS.attack, keys: ["KeyG"] },
    { name: CONTROLS.togglePokemon, keys: ["KeyR"] },
  ];

  return (
    <KeyboardControls map={map}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          position: "relative",
        }}
      >
        <HUD />
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <Perf position="top-left" />

          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Environment preset="city" background blur={0.8} />
          <SoftShadows size={10} samples={10} focus={0.5} />

          <Scene />

          <Grid
            args={[100, 100]}
            cellColor="gray"
            sectionColor="black"
            fadeDistance={30}
            position={[0, 0.01, 0]}
          />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}

export default App;
