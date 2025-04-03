import { useMutation } from "@apollo/client";
import { CREATE_GAME_SESSION, UPDATE_USER } from "../utils/mutations";
import { useState } from "react";

const Home = () => {
  const [createGameSession, { data, loading, error }] = useMutation(CREATE_GAME_SESSION);
  const [updateUser] = useMutation(UPDATE_USER);
  // State to store the game session data
  const [gameSession, setGameSession] = useState<{
    _id: string;
    player: { _id: string };
    score: number;
  } | null>(null);
  const [score, setScore] = useState(0); // Initialize score state



  console.log("Session ID:", gameSession?._id); // Log the session ID for debugging
  console.log("Data:", data); // Log the data for debugging


  const handleCreateSession = async () => {
    try{
      const { data } = await createGameSession({variables: { score: 0 } });
      setGameSession(data.createGameSession); // Set the game session state with the response data
      console.log("Game session data:", data.createGameSession); // Log the game session data for debugging
      //update the score state with the initial score from the response
      setScore(data.createGameSession.score);
      console.log("Game session created:", data.createGameSession);
    }catch (error) {
      console.error("Error creating game session:", error);
    }
  };

  const handleUpdateUser = async (score:number) => {
    console.log("Updating user with score:", score);
    console.log("Session ID:", gameSession?._id); // Log the session ID for debugging
    try { 
      const { data } = await updateUser({
        variables: {
          _id: gameSession?.player._id, // The ID of the user to update
          input: {
            _id: gameSession?._id, // The ID of the game session
            player: { _id: gameSession?.player._id}, // The player object
            score: score, // The new score
          },
        },
      });
      console.log("User updated:", data.updateUser);
    }
    catch (error) { 
      console.error("Error updating user:", error);
    }
  }

  return (
    <div>
      <h1>Welcome to the Game!</h1>
      <button onClick={handleCreateSession}>Start New Game Session</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Game session created with ID: {data.createGameSession._id}</p>}
      {/* create an input field that allows the user to input a number and includes a button called update score. 
        Pass the entered score to setScore. Then call handleUpdateUser now that the score is updated*/}
      <br />
      <h2>Current Score: {score}</h2>
      <input type="number" 
      value={score === 0 ? "" : score} 
      onChange={(e) => {
        const value = e.target.value;
        setScore(value === "" ? 0 : Number(value)); // Allow empty input, but set score to 0 if empty
      }} />
      <button onClick={() => handleUpdateUser(score)}>Update Score</button>
    </div>
  );

}
export default Home;
