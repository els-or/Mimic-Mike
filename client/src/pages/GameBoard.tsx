import { useMutation } from "@apollo/client";
import { CREATE_GAME_SESSION } from "../utils/mutations";
import { useState } from "react";

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

  //create 



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
export default GameBoard;
