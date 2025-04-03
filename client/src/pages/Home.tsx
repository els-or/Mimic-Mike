import { useMutation } from "@apollo/client";
import { CREATE_GAME_SESSION } from "../utils/mutations";

const Home = () => {
  const [createGameSession, { data, loading, error }] = useMutation(CREATE_GAME_SESSION);

  const handleCreateSession = async () => {
    try{
      const { data } = await createGameSession({variables: { score: 0 } });
      console.log("Game session created:", data.createGameSession);
    }catch (error) {
      console.error("Error creating game session:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Game!</h1>
      <button onClick={handleCreateSession}>Start New Game Session</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Game session created with ID: {data.createGameSession._id}</p>}
    </div>
  );

}
export default Home;
