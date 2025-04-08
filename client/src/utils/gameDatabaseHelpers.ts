import { ApolloClient } from "@apollo/client";
import { CREATE_GAME_SESSION, UPDATE_USER } from "../utils/mutations";
import { GameSession } from "../interfaces/GameSession";


//TODO: consider returning the session data and then setting the score in GameBoard.tsx

//#region CREATE GAME SESSION
export async function createGameSession(client: ApolloClient<any>, initialScore: number = 0): Promise<GameSession> {
    const { data } = await client.mutate({
        mutation: CREATE_GAME_SESSION,
        variables: { score: initialScore},
    });

    return data.createGameSession as GameSession;
}
//Christian's code
 // const [createGameSession, { data, loading, error }] =
  //   useMutation(CREATE_GAME_SESSION);

  // const [updateUser] = useMutation(UPDATE_USER);

  // const [gameSession, setGameSession] = useState<{
  //   _id: string;
  //   player: { _id: string };
  //   score: number;
  // } | null>(null);

  // const [score, setScore] = useState(0); UNRELATED - CAN DELETE

  // const [gameStarted, setGameStarted] = useState(false); UNRELATED



    // const handleCreateSession = async () => {
  //   try {
  //     const { data } = await createGameSession({ variables: { score: 0 } });

  //     setGameSession(data.createGameSession);

  //     setScore(data.createGameSession.score);

  //   } catch (error) {
  //     console.error("Error creating game session:", error);
  //   }
  // };


//Lauren's code
/*
//const [createGameSession, { loading, error }] = useMutation(CREATE_GAME_SESSION);

//const [gameSession, setGameSession] = useState<{
  //   _id: string;
  //   player: { _id: string };
  //   score: number;
  // } | null>(null);

  
  //FOR DEBUGGING GAME SESSIONS
  //console.log("Session ID:", gameSession?._id); //Log the session ID for debugging
  //console.log("Data:", data); //Log the data for debugging
*/
  //const handleCreateSession = async () => {
  /*
       console.log("---------------------")
       console.log("running handleCreateSession");
       console.log("---------------------\n")
  */
  //   try{
  //     const { data } = await createGameSession({variables: { score: 0 } }); 

  //     //Set the game session state with the response data
  //     setGameSession(data.createGameSession);

  /*
  //     //Log the game session data for debugging
         console.log("Game session data:", data.createGameSession); 
  */

  //     //update the score state with the initial score from the response
  //     setScore(data.createGameSession.score);

  /*
  //     //Log notification that game session was created.
         console.log("Game session created:", data.createGameSession);
  */
  //   }catch (error) {
  //     console.error("Error creating game session:", error);
  //   }
  // };

//#endregion CREATE GAME SESSION