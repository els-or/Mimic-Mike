import { Link } from "react-router-dom";

export function GameOver() {
  return (
    <div>
      <h1>Game Over</h1>
      <p>Thanks for playing!</p>
      <Link to="/">
        <button>Return to Home</button>
      </Link>
      <Link reloadDocument to="/Multiplayer">
        <button>Play Again</button>
      </Link>
    </div>
  );
}
