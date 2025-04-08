import React from "react";
import "./gameOver.css"; // Import your CSS file for styling

interface GameOverScreenProps {
    score: number;
    onPlayAgain: () => void;
    onQuit: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain, onQuit }) => {
    //!!! Christian: Feel free to style this component as you see fit.
    return (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <p>Your Score: {score}</p>
            <div className="modal-actions">
              <button onClick={onPlayAgain}>Play Again</button>
              <button onClick={onQuit}>Quit</button>
            </div>
          </div>
        </div>
      );
};

export default GameOverScreen;