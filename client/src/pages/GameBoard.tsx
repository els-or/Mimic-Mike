import { useMutation } from "@apollo/client";
import { CREATE_GAME_SESSION } from "../utils/mutations";
import { useState } from "react";
//import PropTypes from "prop-types";
import { boardOneButtons } from "../utils/buttonArray";

//??? see if you can pass in an array of button objects
const GameBoard = () => {
  const [createGameSession, { data, loading, error }] = useMutation(CREATE_GAME_SESSION);
  // State to store the game session data
  const [gameSession, setGameSession] = useState<{
    _id: string;
    player: { _id: string };
    score: number;
  } | null>(null);
  //const [score, setScore] = useState(0); // Initialize score state
  //create state to check if the game is started
  const [gameStarted, setGameStarted] = useState(false);

  //create a state to check if the game pattern is being played

  //TODO: add a useEffect to wait to display the game session data

  console.log("Session ID:", gameSession?._id); // Log the session ID for debugging
  console.log("Data:", data); // Log the data for debugging


  const handleCreateSession = async () => {
    try{
      const { data } = await createGameSession({variables: { score: 0 } });
      setGameSession(data.createGameSession); // Set the game session state with the response data
      console.log("Game session data:", data.createGameSession); // Log the game session data for debugging
      //update the score state with the initial score from the response
      //setScore(data.createGameSession.score);
      console.log("Game session created:", data.createGameSession);
      setGameStarted(true); // Set gameStarted to true when the session is created
    }catch (error) {
      console.error("Error creating game session:", error);
    }
  };



  return (
    <div>
    {gameStarted ? (
        <div>
        <h1>Game Session ID: {gameSession?._id}</h1>
        <p>Player ID: {gameSession?.player._id}</p>
        <p>Score: {gameSession?.score}</p>
        {/* Add your game logic here */}
        <div className="game-board">
            {boardOneButtons.map((button) => (
                <button
                    key={button.id}
                    style={{ backgroundColor: button.color }}
                    onClick={() => {
                        // Handle button click
                        console.log(`Button ${button.text} clicked`);
                        // Play sound here if needed
                    }}
                >
                    {button.text}
                </button>
            ))}
        </div>
    </div>
    ) : 
    (
    <div>
        <h1>Welcome to the Game!</h1>
        <button onClick={handleCreateSession}>Start New Game Session</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && <p>Game session created with ID: {data.createGameSession._id}</p>}
    </div>
    )}

    </div>
  );

}

// GameBoard.propTypes = {
//   boardOneButtons: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       text: PropTypes.string.isRequired,
//       color: PropTypes.string.isRequired,
//       sound: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

export default GameBoard;
