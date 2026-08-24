import { useState, useEffect } from "react";
import Button from "../../feature/Button";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.css";

function StageSelectPage() {
  const [roomCode, setRoomCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.roomCode) {
      setRoomCode(location.state.roomCode);
    }
  }, [location.state]);

  const stages = [
    { id: 1, name: "Stage 1", description: "Basic tutorial stage" },
    { id: 2, name: "Stage 2", description: "Intermediate challenges" },
    { id: 3, name: "Stage 3", description: "Advanced gameplay" },
    { id: 4, name: "Stage 4", description: "Expert level" },
  ];

  const handleStageSelect = (stageId: number) => {
    if (roomCode.trim()) {
      navigate(`/game/stage${stageId}/${roomCode}`);
    }
  };

  return (
    <div className={styles["stage-select-page-wrapper"]}>
      <div className={styles["stage-select-page-container"]}>
        <header className={styles["stage-select-header"]}>
          <p className={styles["eyebrow"]}>AR Maze Player</p>
          <h1>Stage Select</h1>
          <p>挑戦するステージを選んでね</p>
        </header>

        <div className={styles["room-code-field"]}>
          <label htmlFor="roomCode">Room Code</label>
          <span>
            {roomCode.trim() ? "接続中" : "ルームコードを入力してください"}
          </span>
        </div>
        <input
          id="roomCode"
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className={styles["input-style"]}
        />

        <div className={styles["stage-grid"]}>
          {stages.map((stage) => (
            <article key={stage.id} className={styles["stage-card"]}>
              <div className={styles["stage-number"]}>0{stage.id}</div>
              <div className={styles["stage-card-content"]}>
                <h2>{stage.name}</h2>
                <p>{stage.description}</p>
              </div>
              <Button
                onClick={() => handleStageSelect(stage.id)}
                disabled={!roomCode.trim()}
              >
                Play
              </Button>
            </article>
          ))}
        </div>

        <NavLink to="/" className={styles["back-link"]}>
          <Button>Back to Title</Button>
        </NavLink>
      </div>
    </div>
  );
}

export default StageSelectPage;
