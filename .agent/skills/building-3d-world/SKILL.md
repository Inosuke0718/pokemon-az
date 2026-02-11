---
name: building-3d-world
description: Constructs a 3D environment using React Three Fiber and ecctrl. Use when the user asks to build the map, place characters, or setup physics for the Z-A clone.
---

# Build 3D World with Ecctrl

## When to use this skill
- When setting up the initial 3D scene (Canvas, Lights).
- When implementing the player controller (WASD movement).
- When placing environmental objects (City, Floor) and enemies.

## Workflow
- [ ] Install dependencies if missing (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `ecctrl`).
- [ ] Setup `Canvas` with `Physics` and `KeyboardControls`.
- [ ] Implement Player Character using `<Ecctrl>`.
- [ ] Place "Wild Pokemon" triggers (Sensor RigidBody).

## Instructions

### 1. Scene Setup
Use `src/components/GameScene.tsx` as the entry point.
Always wrap physics objects in `<Physics debug={true}>` for MVP visibility.
Configure lights to ensure visibility.

```tsx
// Example structure
<Canvas shadows>
  <Lights />
  <Physics debug={true}>
    <Player />
    <Floor />
    <Enemies />
  </Physics>
</Canvas>
```

### 2. Player Controller Implementation
Use `ecctrl` for the character. Do not build a custom controller.
Ensure `KeyboardControls` map includes: `forward`, `backward`, `left`, `right`, `jump`, `run`.

```tsx
import Ecctrl from 'ecctrl';

// Inside Canvas > Physics
<Ecctrl debug animated={false}>
  <mesh castShadow position={[0, 0.5, 0]}>
    <capsuleGeometry args={[0.5, 1]} />
    <meshStandardMaterial color="cyan" />
  </mesh>
</Ecctrl>
```

### 3. Wild Pokemon Triggers
Place enemies as simple boxes with the `sensor` prop.
When the player enters the sensor, it should log to the console (or trigger the store if available).

```tsx
import { RigidBody } from '@react-three/rapier';

// Inside Canvas > Physics
<RigidBody 
  type="fixed" 
  colliders="cuboid" 
  sensor 
  onIntersectionEnter={() => {
    console.log('Battle Start! (Triggered by Sensor)');
    // usage: useBattleStore.getState().startBattle('pikachu');
  }}
>
  <mesh position={}> [app.gamedia](https://app.gamedia.jp/game/4377)
    <boxGeometry args={} /> [reddit](https://www.reddit.com/r/pokemon/comments/1j18ooo/if_you_were_tasked_with_making_the_gen_10_gimmick/)
    <meshStandardMaterial color="red" />
  </mesh>
</RigidBody>
```

### 4. Asset Handling
- **Mock First**: If no `.glb` file is available, use primitive shapes (`<boxGeometry>`, `<planeGeometry>`) immediately.
- **Floor**: Create a large static floor so the player doesn't fall.
  ```tsx
  <RigidBody type="fixed">
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={} />
      <meshStandardMaterial color="green" />
    </mesh>
  </RigidBody>
  ```
- Do not spend time on complex shaders or realistic lighting settings.
```