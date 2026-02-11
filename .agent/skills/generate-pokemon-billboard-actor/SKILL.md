---
name: generating-pokemon-billboard-actors
description: Generates a 2D sprite for a specific Pokemon and implements it as a Billboard actor in the React Three Fiber scene. Use when the user wants to populate the world with Pokemon characters.
---

# Generating Pokemon Billboard Actors

## When to use this skill

- The user asks to "add Pikachu" or any other Pokemon to the scene.
- The user needs 2D sprites that always face the camera (Billboard style).
- The user wants to generate placeholder or stylized assets for the game entities.

## Workflow

1.  **Check for Component**: Verify if a generic `PokemonBillboard` component exists in `src/components/`. If not, create it.
2.  **Generate Asset**: Use `generate_image` to create the sprite texture based on the Pokemon name.
3.  **Implement/Spawn**: Add the component to the main scene (e.g., `Experience.tsx`) using the generated asset.

## Instructions

### 1. Image Generation

Use the `generate_image` tool with the following prompt strategies.

**Parameters:**

- **AspectRatio**: 1:1
- **Format**: PNG (Transparent)

**Prompt Templates:**

- **Default (Inspired)**: "Create an original creature inspired by [POKEMON_NAME]. Requirements: front-facing, full body, clean outline, cel-shaded game sprite, transparent background PNG, centered with small padding, consistent style, no text, no watermark, no logo, no signature."
- **Literal**: "Create [POKEMON_NAME] as a clean game sprite. Requirements: front-facing, full body, clean outline, cel-shaded game sprite, transparent background PNG, centered with small padding, no text, no watermark, no logo, no signature."

### 2. Component Architecture

The component should use `@react-three/drei`'s `Billboard` to ensure the sprite always faces the camera.

**Recommended Implementation (`src/components/PokemonBillboard.tsx`):**

```tsx
import { Billboard, Image } from "@react-three/drei";

interface PokemonBillboardProps {
  spriteUrl: string;
  position: [number, number, number];
  scale?: number;
  transparent?: boolean;
}

export const PokemonBillboard = ({
  spriteUrl,
  position,
  scale = 1,
  transparent = true,
}: PokemonBillboardProps) => {
  return (
    <Billboard position={position} follow={true}>
      <Image url={spriteUrl} scale={scale} transparent={transparent} />
    </Billboard>
  );
};
```

### 3. Integration

When adding to the scene:

- Import the `PokemonBillboard` component.
- Pass the local path or data URL of the generated image to `spriteUrl`.
- Position appropriately on the map (usually `y: 0.5` or `y: 1` depending on pivot).

## Resources

- **Library**: `npm install @react-three/drei @react-three/fiber three` (ensure these are installed).
