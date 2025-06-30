import "./App.css";
import { Route, Routes } from "react-router-dom";
import TitlePage from "./components/pages/TitlePage/page";
import GamePage from "./components/pages/GamePage/page";
import EditPage from "./components/pages/EditPage/page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitlePage />} />
      <Route path="/game/:roomCode" element={<GamePage />} />
      <Route path="/edit" element={<EditPage />} />
      {/* Add other routes as needed */}
    </Routes>
  );
}

export default App;
