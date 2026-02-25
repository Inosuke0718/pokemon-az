import { useThree, useFrame } from "@react-three/fiber";
import { useState, useMemo } from "react";
import { Chunk } from "./Chunk";

const CHUNK_SIZE = 50; // Size of each chunk
const RENDER_DISTANCE = 2; // Radius of chunks to render around the player (e.g. 1 means 3x3 grid)

export const WorldManager = () => {
  const { camera } = useThree();
  const [currentChunk, setCurrentChunk] = useState<[number, number]>([0, 0]);

  useFrame(() => {
    // Calculate current chunk based on camera position (assuming camera follows player)
    // Using Math.round helps center the chunk around the coordinate
    const cx = Math.round(camera.position.x / CHUNK_SIZE);
    const cz = Math.round(camera.position.z / CHUNK_SIZE);

    if (cx !== currentChunk[0] || cz !== currentChunk[1]) {
      setCurrentChunk([cx, cz]);
    }
  });

  const visibleChunks = useMemo(() => {
    const chunks = [];
    const [cx, cz] = currentChunk;
    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
      for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
        chunks.push([cx + x, cz + z] as [number, number]);
      }
    }
    return chunks;
  }, [currentChunk]);

  return (
    <group>
      {visibleChunks.map(([x, z]) => (
        <Chunk key={`${x},${z}`} position={[x, z]} size={CHUNK_SIZE} />
      ))}
    </group>
  );
};
