import { create } from "zustand";

export interface Pokemon {
  id: string; // Unique instance ID
  speciesId: number; // Pokedex number
  name: string;
  level: number;
  caughtAt: Date;
}

export interface Item {
  id: string;
  name: string;
  count: number;
}

interface GameState {
  characters: any[];
  playerState: {
    health: number;
    maxHealth: number;
    stamina: number;
  };
  inventory: {
    items: Item[];
    pokemons: Pokemon[];
  };
  playerRef: any;
  activePokemonId: string | null;
  actions: {
    setPlayerRef: (ref: any) => void;
    decreasePlayerHealth: (amount: number) => void;
    setStamina: (stamina: number) => void;
    addPokemon: (pokemon: Pokemon) => void;
    addItem: (item: Item) => void;
    removeItem: (itemId: string, count: number) => void;
    setActivePokemon: (id: string | null) => void;
  };
}

export const useGameStore = create<GameState>((set) => ({
  characters: [],
  playerState: {
    health: 100,
    maxHealth: 100,
    stamina: 100,
  },
  inventory: {
    items: [
      { id: "pokeball", name: "Poke Ball", count: 20 }, // Start with 20 balls
    ],
    pokemons: [
      {
        id: "starter-pikachu",
        speciesId: 25,
        name: "Pikachu",
        level: 5,
        caughtAt: new Date(),
      },
    ],
  },
  playerRef: null,
  activePokemonId: null,
  actions: {
    setPlayerRef: (ref) => set({ playerRef: ref }),
    decreasePlayerHealth: (amount) =>
      set((state) => ({
        playerState: {
          ...state.playerState,
          health: Math.max(0, state.playerState.health - amount),
        },
      })),
    setStamina: (stamina) =>
      set((state) => ({
        playerState: {
          ...state.playerState,
          stamina: Math.max(0, Math.min(100, stamina)),
        },
      })),
    addPokemon: (pokemon) =>
      set((state) => ({
        inventory: {
          ...state.inventory,
          pokemons: [...state.inventory.pokemons, pokemon],
        },
      })),
    addItem: (item) =>
      set((state) => {
        const existing = state.inventory.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            inventory: {
              ...state.inventory,
              items: state.inventory.items.map((i) =>
                i.id === item.id ? { ...i, count: i.count + item.count } : i,
              ),
            },
          };
        }
        return {
          inventory: {
            ...state.inventory,
            items: [...state.inventory.items, item],
          },
        };
      }),
    removeItem: (itemId, count) =>
      set((state) => ({
        inventory: {
          ...state.inventory,
          items: state.inventory.items.map((i) =>
            i.id === itemId ? { ...i, count: Math.max(0, i.count - count) } : i,
          ),
        },
      })),
    setActivePokemon: (id) => set({ activePokemonId: id }),
  },
}));
