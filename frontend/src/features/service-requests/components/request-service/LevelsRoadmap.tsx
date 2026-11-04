import { LEVEL_STEPS } from "./types";

interface LevelsRoadmapProps {
  currentLevel: number;
  onSelectLevel: (level: number) => void;
}

export function LevelsMobileBar({ currentLevel, onSelectLevel }: LevelsRoadmapProps) {
  return (
    <div className="levels-mobile-bar">
      {LEVEL_STEPS.map((s) => {
        const isActive = currentLevel === s.level;
        const isCompleted = currentLevel > s.level;
        return (
          <button
            key={s.level}
            type="button"
            className={`mobile-level-pill ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
            onClick={() => onSelectLevel(s.level)}
          >
            {isCompleted ? (
              <i className="fas fa-check text-[10px]"></i>
            ) : (
              <span>{s.level}</span>
            )}
            <span>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LevelsSidebar({ currentLevel, onSelectLevel }: LevelsRoadmapProps) {
  return (
    <div className="levels-stepper-column">
      <div className="levels-stepper-card">
        <div className="levels-sidebar-header">
          <div>
            <h3>Levels Roadmap</h3>
            <p>Step-by-step service posting</p>
          </div>
          <span className="levels-count-pill">{currentLevel}/4</span>
        </div>

        <div className="levels-list">
          {LEVEL_STEPS.map((s, idx) => {
            const isActive = currentLevel === s.level;
            const isCompleted = currentLevel > s.level;
            const isLast = idx === LEVEL_STEPS.length - 1;

            return (
              <div
                key={s.level}
                className={`level-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                onClick={() => onSelectLevel(s.level)}
              >
                <div className="level-item-indicator">
                  <div className="level-bubble">
                    {isCompleted ? (
                      <i className="fas fa-check text-[11px]"></i>
                    ) : (
                      s.level
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`level-connector-line ${isCompleted ? "completed" : ""}`}
                    ></div>
                  )}
                </div>

                <div className="level-item-body">
                  <div className="level-label">{s.label}</div>
                  <div className="level-title">{s.title}</div>
                  <div className="level-subtext">{s.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
