---
name: creating-game-fields
description: Designs and implements 3D game fields and levels using React Three Fiber and Cannon.js. Use when the user wants to create terrains, tracks, or level environments.
---

# Creating Game Fields

## When to use this skill

- User wants to create a new game level or field.
- User wants to add terrain or landscapes.
- User wants to implement level geometry with physics (collisions).
- User references `racing-game` field design patterns.

## Workflow

1.  **Scene & Physics Setup**: ensure `<Canvas>` wraps `<Physics>` (broadphase="SAP" recommended).
2.  **Terrain Generation**: Use `Heightmap` (heightfield physics) or GLTF meshes (trimesh/convexpoly).
3.  **Environment Setup**: Add Sky, Lighting, and Fog.
4.  **Track/Object Placement**: Load GLTF models and assign individual nodes to physics bodies or visual groups.
5.  **Optimization**: Use `Layers` to manage visibility (e.g., raycasting vs rendering).

## Instructions

### 1. Physics & Scene Setup

The field must be contained within a Physics world.

```tsx
<Canvas dpr={[1, 2]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
  <fog attach="fog" args={["white", 0, 500]} />
  <Sky sunPosition={[100, 10, 100]} />
  <ambientLight intensity={0.1} />
  <Physics
    allowSleep
    broadphase="SAP"
    defaultContactMaterial={{ contactEquationRelaxation: 4, friction: 1e-3 }}
  >
    <Track />
    <Heightmap />
  </Physics>
</Canvas>
```

### 2. Terrain with Heightmap

Use a grayscale image to generate a heightfield collider.
See [examples/Heightmap.tsx](examples/Heightmap.tsx) for the implementation reference.

### 3. Loading Track/Level Geometry

Use `useGLTF` to load the model and extract nodes.
Assign refs to `useStore` if game logic needs to access the level objects.

See [examples/Track.tsx](examples/Track.tsx) for the implementation reference.

### 4. Interactive Editor (Leva)

Integrating `leva` allows for real-time tweaking of physics and light parameters.

```tsx
const { shadowBias } = useControls('Lights', { shadowBias: -0.001 })
<directionalLight shadow-bias={shadowBias} ... />
```

## Best Practices

- **Separation of Concerns**: Keep visual meshes and physics bodies in sync but distinct if necessary.
- **GLTF Instancing**: If placing many identical objects (trees, specific track barriers), use InstancedMesh.
- **Layers**: Use `new Layers()` to control what the camera sees vs what raycasters hit.
- **Refs**: Store refs to major level components in a global store (Zustand) for access by game logic (e.g. `level.current`).

## Resources

- [examples/Heightmap.tsx](examples/Heightmap.tsx)
- [examples/Track.tsx](examples/Track.tsx)
