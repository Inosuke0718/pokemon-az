import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Box, Cylinder } from "@react-three/drei";
import { Enemy } from "../Enemy";

// Simple deterministic random function
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface ChunkProps {
  position: [number, number]; // Chunk coordinates [x, z]
  size?: number; // Size of one chunk (default: 50)
}

export const Chunk = ({ position, size = 50 }: ChunkProps) => {
  const [cx, cz] = position;
  const worldX = cx * size;
  const worldZ = cz * size;

  // Determine biome based on distance from center
  const { isCity, items, enemies } = useMemo(() => {
    const dist = Math.sqrt(cx * cx + cz * cz);
    const isCity = dist < 2; // Center 3x3 chunks are city
    const itemCount = isCity ? 10 : 20;
    const items = [];
    const enemies = [];

    // Generate Items (Trees/Buildings)
    for (let i = 0; i < itemCount; i++) {
      const seed = cx * 1000 + cz * 100 + i;
      const rx = seededRandom(seed);
      const rz = seededRandom(seed + 1);
      const scale = 0.5 + seededRandom(seed + 2);

      const x = (rx - 0.5) * size;
      const z = (rz - 0.5) * size;

      const isBuilding = isCity;
      const height = isBuilding
        ? 10 + seededRandom(seed + 4) * 30
        : 2 + seededRandom(seed + 4) * 3;

      items.push({
        position: [x, 0, z] as [number, number, number],
        scale: scale,
        rotation: seededRandom(seed + 3) * Math.PI,
        type: isBuilding ? "building" : "tree",
        height: height,
        color: isBuilding
          ? `hsl(${200 + seededRandom(seed) * 40}, 60%, ${30 + seededRandom(seed + 1) * 20}%)`
          : undefined, // Random building color
      });
    }

    // Generate Enemies
    // More enemies in wild, but ensure city has some
    const enemyCount = isCity
      ? seededRandom(cx * 99 + cz) > 0.3
        ? 2
        : 1 // 70% chance 2 enemies, else 1
      : Math.floor(seededRandom(cx * 99 + cz) * 3) + 2; // 2-4 enemies in wild

    for (let i = 0; i < enemyCount; i++) {
      const seed = cx * 2000 + cz * 200 + i;
      const rx = seededRandom(seed);
      const rz = seededRandom(seed + 1);

      const x = (rx - 0.5) * size;
      const z = (rz - 0.5) * size;

      enemies.push({
        position: [x, 5, z] as [number, number, number],
      });
    }

    return { isCity, items, enemies };
  }, [cx, cz, size]);

  return (
    <group position={[worldX, 0, worldZ]}>
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <boxGeometry args={[size, size, 1]} />
          <meshStandardMaterial
            color={isCity ? "#333" : "#4a4"}
            roughness={isCity ? 0.8 : 1}
          />
        </mesh>
        {/* City Sidewalks / Road Lines (Simplified) */}
        {isCity && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
            <planeGeometry args={[size, size]} />
            <meshStandardMaterial color="#444" transparent opacity={0.5} />
          </mesh>
        )}
      </RigidBody>

      {/* Objects */}
      {items.map((item, index) => (
        <group
          key={`item-${index}`}
          position={item.position}
          rotation={[0, item.rotation, 0]}
        >
          {item.type === "building" ? (
            <RigidBody type="fixed" colliders="cuboid">
              <Box
                args={[3 * item.scale, item.height, 3 * item.scale]}
                position={[0, item.height / 2, 0]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial
                  color={item.color || "#888"}
                  metalness={0.5}
                  roughness={0.2}
                />
              </Box>
              {/* Windows (Emissive stripes) */}
              <Box
                args={[3.1 * item.scale, item.height * 0.9, 3.1 * item.scale]}
                position={[0, item.height / 2, 0]}
              >
                <meshStandardMaterial
                  color="black"
                  emissive="#aaddff"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.3}
                />
              </Box>
            </RigidBody>
          ) : (
            // Simple Tree
            <group>
              {/* Trunk */}
              <RigidBody type="fixed" colliders="hull">
                <Cylinder
                  args={[0.3 * item.scale, 0.5 * item.scale, 1.5 * item.scale]}
                  position={[0, 0.75 * item.scale, 0]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial color="#533" />
                </Cylinder>
              </RigidBody>
              {/* Leaves */}
              <Cylinder
                args={[0, 1.5 * item.scale, 3 * item.scale]}
                position={[0, 2.5 * item.scale, 0]}
                castShadow
              >
                <meshStandardMaterial color="#284" />
              </Cylinder>
            </group>
          )}
        </group>
      ))}

      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <Enemy key={`enemy-${index}`} position={enemy.position} />
      ))}

      {/* Lumiose Tower Placeholder (Only at 0,0) */}
      {cx === 0 && cz === 0 && (
        <RigidBody type="fixed" colliders="trimesh">
          <Cylinder args={[2, 6, 30]} position={[0, 15, 0]} castShadow>
            <meshStandardMaterial
              color="#44f"
              emissive="#119"
              emissiveIntensity={0.5}
            />
          </Cylinder>
          <Box args={[10, 1, 10]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
        </RigidBody>
      )}
    </group>
  );
};
