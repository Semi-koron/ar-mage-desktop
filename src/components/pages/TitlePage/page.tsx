import Button from "../../feature/Button";
import { NavLink } from "react-router-dom";

function TitlePage() {
  return (
    <>
      <h1>AR Mage Player</h1>
      <NavLink to="/game">
        <Button>Click me</Button>
      </NavLink>
    </>
  );
}

export default TitlePage;
