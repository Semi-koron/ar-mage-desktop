import { useState } from "react";
import Button from "../../feature/Button";
import { NavLink } from "react-router-dom";

function TitlePage() {
  const [roomCode, setRoomCode] = useState("");
  return (
    <>
      <h1>AR Mage Player</h1>
      <p>Please input your room code:</p>
      <input
        type="text"
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <NavLink to={`/game/${roomCode}`}>
        <Button onClick={() => console.log(roomCode)}>Join Game</Button>
      </NavLink>
    </>
  );
}

export default TitlePage;
