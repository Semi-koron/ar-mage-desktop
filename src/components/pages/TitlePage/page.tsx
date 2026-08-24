import { useState } from "react";
import styles from "./index.module.css";
import Button from "../../feature/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { NavLink } from "react-router-dom";

function TitlePage() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className={styles["title-page-wrapper"]}>
      <div className={styles["title-page-container"]}>
        <div className={styles["title-text"]}>
          <h1>AR Maze Player</h1>
          <img
            src="/maze.svg"
            alt="MazeLogo"
            className={styles["title-image"]}
          />
        </div>
        <p>ルームのコードを入れてね</p>
        <input
          type="text"
          placeholder="Room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className={styles["input-style"]}
        />
        <NavLink to={`/game/${roomCode}`}>
          <Button onClick={() => console.log(roomCode)}>
            Join Game
            <ArrowForwardIcon className={styles["arrow-icon"]} />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}

export default TitlePage;
