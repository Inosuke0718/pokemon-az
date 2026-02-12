---
name: implementing-pokemon-battles
description: Guideline for implementing a turn-based Pokemon battle system using React Three Fiber, Zustand, and HTML overlay UI. Use when the user wants to implement battle logic or UI.
---

# Implementing Pokemon Battles

## When to use this skill

- User wants to create a battle system.
- User wants to implement turn-based logic.
- User needs to visualize attacks and HP changes in 3D.
- User references `racing-game` only for architectural patterns (Store -> Visuals).

## Architecture

This skill follows the pattern found in `racing-game` and `pokemon-az`: **State drives View**.

1.  **Logic Layer (Zustand)**: Holds all battle data (HP, turns, status effects).
2.  **Visual Layer (R3F)**: Subscribes to the store and updates animations/positions accordingly.
3.  **UI Layer (HTML/Leva)**: Dispatches actions to the store (Command selection).

## Workflow

1.  **Define Store**: Create a `BattleStore` to hold Pokemon data, moves, and turn state.
2.  **Create Entity**: Create a `BattlePokemon` component that reads from the store and handles GLTF loading/animation.
3.  **Overlay UI**: Use `<Html>` from `@react-three/drei` for in-world UI (HP bars) and standard React DOM for HUD (Move selection).
4.  **Game Loop**: Use `useFrame` for continuous updates if needed (e.g., camera sway), but rely on Store state for turn progression.

## Instructions

### 1. Battle Store Setup

Similar to `racing-game/store.ts`, create a dedicated store for the battle.

```typescript
// See examples/battleStore.ts
export const useBattleStore = create<BattleState>((set, get) => ({
  phase: 'intro',
  playerPokemon: { ... },
  opponentPokemon: { ... },
  executeMove: (moveId) => {
      // Calculate damage
      // Update HP
      // Set phase to 'execution'
      // Trigger animations
  }
}))
```

### 2. Entity Component (Pokemon)

Use `useGLTF` and `useAnimations` to handle the 3D model.
Synch animations with the `phase` state from the store.

```tsx
// See examples/BattlePokemon.tsx
const { actions } = useAnimations(animations, group);
const phase = useBattleStore((state) => state.phase);

useEffect(() => {
  if (phase === "execution") actions["Attack"].play();
}, [phase]);
```

### 3. UI Overlay

Combine R3F Canvas and standard HTML div overlays.
Use `@react-three/drei`'s `<Html>` for elements that need to stick to 3D objects (HP bars).

```tsx
<Canvas>
  <BattlePokemon ... >
    <Html position={[0, 2, 0]}>
       <HPBar />
    </Html>
  </BattlePokemon>
</Canvas>
<div className="hud-overlay">
   {/* Move Selection UI */}
</div>
```

## Resources

- [examples/battleStore.ts](examples/battleStore.ts)
- [examples/BattlePokemon.tsx](examples/BattlePokemon.tsx)
- [examples/BattleScene.tsx](examples/BattleScene.tsx)
