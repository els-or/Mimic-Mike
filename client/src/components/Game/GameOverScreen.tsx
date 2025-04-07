import React from "react";

interface GameOverScreenProps {
    score: number;
    onPlayAgain: () => void;
    onQuit: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain, onQuit }) => {
    //!!! Christian: Feel free to style this component as you see fit.
    return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h2>Game Over</h2>
        <p>Your Score: {score}</p>
        <button onClick={onPlayAgain}>Play Again</button>
        <button onClick={onQuit}>Quit</button> 
      </div>
    </div>
    );
};

export default GameOverScreen;