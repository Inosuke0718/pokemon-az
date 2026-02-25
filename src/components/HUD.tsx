import { useGameStore } from "../store";

export const HUD = () => {
  const { playerState, inventory } = useGameStore((state) => ({
    playerState: state.playerState,
    inventory: state.inventory,
  }));

  const hpPercent = (playerState.health / playerState.maxHealth) * 100;
  const staminaPercent = playerState.stamina; // 0-100

  return (
    <div className="hud-container">
      {/* Player Status Top-Left */}
      <div className="glass-panel player-info">
        <div className="player-name">
          <span>Trainer Red</span>
          <span className="level-badge">Lv. 50</span>
        </div>

        {/* HP Bar */}
        <div>
          <div className="bar-label">
            <span>HP</span>
            <span>
              {Math.floor(playerState.health)}/{playerState.maxHealth}
            </span>
          </div>
          <div className="bar-container">
            <div className="hp-bar" style={{ width: `${hpPercent}%` }} />
          </div>
        </div>

        {/* Stamina Bar */}
        <div>
          <div className="bar-label">
            <span>STAMINA</span>
          </div>
          <div className="bar-container">
            <div
              className="stamina-bar"
              style={{ width: `${staminaPercent}%` }}
            />
          </div>
        </div>

        {/* Party Pokemon (Placeholder) */}
        <div className="party-container">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`party-slot ${i === 0 ? "active" : ""}`}
              title={i === 0 ? "Active Pokemon" : "Slot " + (i + 1)}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background:
                    i < (inventory.pokemons.length || 1)
                      ? "#ef4444"
                      : "rgba(255,255,255,0.2)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Menu Bottom-Right */}
      <div className="glass-panel action-menu">
        <button className="action-btn btn-fight">
          FIGHT
          <span className="key-hint">G</span>
        </button>
        <button className="action-btn btn-pokemon">
          POKEMON
          <span className="key-hint">P</span>
        </button>
        <button className="action-btn btn-bag">
          BAG [x{inventory.items.find((i) => i.id === "pokeball")?.count || 0}]
          <span className="key-hint">F</span>
        </button>
        <button className="action-btn btn-run">
          RUN
          <span className="key-hint">Shift</span>
        </button>
      </div>

      {/* Crosshair (Optional but useful for aiming) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "white",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: 0.8,
          boxShadow: "0 0 4px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
};
