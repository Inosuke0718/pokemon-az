```markdown
---
name: implementing-battle-logic
description: Creates a turn-based battle system using Zustand for state management. Use when the user asks to implement battle mechanics, damage calculation, or game loop logic for the Z-A clone.
---

# Implement Battle System Logic

## When to use this skill
- When implementing the core battle loop (Player Turn -> Enemy Turn).
- When defining the data structure for Pokemon stats and moves.
- When creating the Zustand store for battle state (`useBattleStore`).

## Workflow
- [ ] Define TypeScript interfaces for `Pokemon`, `Move`, and `BattleState`.
- [ ] Create `useBattleStore` with Zustand.
- [ ] Implement `attack` action with simple damage formula.
- [ ] Implement `enemyAI` action (simple random move).
- [ ] Validation: Test logic via console (no UI required).

## Instructions

### 1. Data Structures
Create `src/types/battle.ts` with minimal types:
```typescript
export type Turn = 'player' | 'enemy' | 'finished';

export interface Pokemon {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  moves: Move[];
}

export interface Move {
  name: string;
  power: number;
  type: string;
}
```

### 2. State Management (Zustand)
Create `src/store/useBattleStore.ts`.
Ensure the store includes:
- `player`: Pokemon | null
- `enemy`: Pokemon | null
- `turn`: Turn
- `logs`: string[]
- Actions: 
  - `startBattle(enemyId: string)`
  - `attack(moveIndex: number)`
  - `runEnemyTurn()`

### 3. Damage Logic Template
Use this simplified formula for MVP (ignore types for now):
```typescript
const damage = Math.floor(move.power * (Math.random() * 0.4 + 0.8));
```

### 4. Validation Loop
Before marking as done, run this in the browser console to verify:
```javascript
// Expose store for debugging in development only
if (import.meta.env.DEV) {
  window.battle = useBattleStore.getState();
}
// Test: window.battle.attack(0)
```