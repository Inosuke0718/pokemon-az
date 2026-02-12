import create from "zustand";

export interface Pokemon {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  types: string[];
  moves: Move[];
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
}

export interface Move {
  id: string;
  name: string;
  power: number;
  accuracy: number;
  type: string;
  pp: number;
  maxPp: number;
}

interface BattleState {
  phase:
    | "intro"
    | "turn_start"
    | "player_choice"
    | "execution"
    | "turn_end"
    | "win"
    | "lose";
  turn: number;
  playerPokemon: Pokemon | null;
  opponentPokemon: Pokemon | null;

  // Actions
  setPhase: (phase: BattleState["phase"]) => void;
  startBattle: (player: Pokemon, opponent: Pokemon) => void;
  executeMove: (attacker: "player" | "opponent", moveId: string) => void;
  nextTurn: () => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: "intro",
  turn: 0,
  playerPokemon: null,
  opponentPokemon: null,

  setPhase: (phase) => set({ phase }),

  startBattle: (player, opponent) => {
    set({
      phase: "intro",
      turn: 1,
      playerPokemon: player,
      opponentPokemon: opponent,
    });
    // Transition to turn start after intro
    setTimeout(() => set({ phase: "turn_start" }), 2000);
  },

  executeMove: (attacker, moveId) => {
    const { playerPokemon, opponentPokemon } = get();
    if (!playerPokemon || !opponentPokemon) return;

    set({ phase: "execution" });

    const source = attacker === "player" ? playerPokemon : opponentPokemon;
    const target = attacker === "player" ? opponentPokemon : playerPokemon;
    const move = source.moves.find((m) => m.id === moveId);

    if (!move) return;

    // Damage calculation (simplified)
    const damage = Math.floor(
      (move.power * source.stats.attack) / target.stats.defense,
    );
    const newTargetHp = Math.max(0, target.hp - damage);

    // Update state
    if (attacker === "player") {
      set({ opponentPokemon: { ...opponentPokemon, hp: newTargetHp } });
    } else {
      set({ playerPokemon: { ...playerPokemon, hp: newTargetHp } });
    }

    // Check win/lose
    if (newTargetHp === 0) {
      set({ phase: attacker === "player" ? "win" : "lose" });
    } else {
      setTimeout(() => get().nextTurn(), 1000);
    }
  },

  nextTurn: () => {
    set((state) => ({
      turn: state.turn + 1,
      phase: "turn_start",
    }));
  },
}));
