import "./App.css";
import { Route, Routes } from "react-router-dom";
import TitlePage from "./components/pages/TitlePage/page";
import GamePage from "./components/pages/GamePage/page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitlePage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;
