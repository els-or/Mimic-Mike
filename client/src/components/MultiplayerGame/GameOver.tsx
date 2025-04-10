import { Link } from "react-router-dom";
import "../../styles/Multiplayer.css";

export function GameOver() {
  return (
    <div className="game-over-container">
      <h1>Game Over</h1>
      <p>Thanks for playing!</p>
      <div className="button-container">
        <Link to="/" className="game-button">
          Return to Home
        </Link>
        <Link reloadDocument to="/Multiplayer" className="game-button">
          Play Again
        </Link>
      </div>
    </div>
  );
}
