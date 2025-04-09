import React from "react";
import "./GameOver.css";

interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
  onQuit: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onPlayAgain,
  onQuit,
}) => {
  return (
    <div className="game-over-modal">
      <div className="game-over-content">
        <h2>Game Over</h2>
        <p className="final-score">
          Your Score: <span>{score}</span>
        </p>
        <p className="game-over-message">
          {score < 5
            ? "Nice try! Keep practicing to improve your memory."
            : score < 10
            ? "Good job! You're getting better!"
            : "Amazing! You have an excellent memory!"}
        </p>
        <div className="modal-actions">
          <button className="play-again-btn" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="quit-btn" onClick={onQuit}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
