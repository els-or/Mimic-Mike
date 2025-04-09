import { ApolloClient } from "@apollo/client";
import { CREATE_GAME_SESSION, UPDATE_USER, DELETE_GAME_SESSION } from "../utils/mutations";
import { QUERY_ME } from "./queries";
import { GameSession } from "../interfaces/GameSession";
import { UserData } from "../interfaces/UserData";


//TODO: consider returning the session data and then setting the score in GameBoard.tsx

export async function createGameSession(
    client: ApolloClient<any>, 
    initialScore: number = 0): Promise<GameSession | null>{
        try{
                const { data } = await client.mutate({
                mutation: CREATE_GAME_SESSION,
                variables: { score: initialScore},
                });
        
                return data.createGameSession as GameSession;

        }catch(error){
            console.error("Failed to create game session:", error);
            //Return null or handle error as needed
            return null; 
        }
}

export async function updateUserScore(client: ApolloClient<any>, gameSession: GameSession, localScore: number): Promise<UserData | null>{
    try{
        // console.log("CLIENT = ", client);
        // console.log("GAME SESSION = ", gameSession);
        // console.log("GAME P ID = ", gameSession?.player._id);
        // console.log("LOCAL SCORE = ", localScore);
        // console.log("GAME SESSION ID = ", gameSession?._id);

        
        const { data } = await client.mutate({
            mutation: UPDATE_USER,
            variables: {
                _id: gameSession?.player._id, // The ID of the user to update
                input: {
                  _id: gameSession?._id, // The ID of the game session
                  player: { _id: gameSession?.player._id}, // The player object
                  score: localScore, // The score to update
                },
              },
        });
        //console.log("UPDATE_USER DATA:", data )
        //Return the updated user or null if no user is returned
        return data.updateUser 

    }catch(error){
        console.error("Failed to update user:", error);
        return null; // Return null on failure to update the user
    }
}

export async function getUser(client: ApolloClient<any>): Promise<UserData | null> {
    try {
        const { data } = await client.query({
            query: QUERY_ME,
        });

        if (data && data.me) {
            // Return the current user's data (you can adjust what fields are returned)
            return data.me;
        }

        //console.log('No user data found.');
        return null;

    } catch (error) {
        console.error('Error fetching current user data:', error);
        return null;
    }
}

export async function deleteGameSession(client: ApolloClient<any>, gameSessionId: string): Promise<GameSession | null> {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_GAME_SESSION,
        variables: { _id: gameSessionId },
      });
  
      //console.log("Deleted game session:", data?.deleteGameSession); // 👈 log the returned session
  
      return data.deleteGameSession as GameSession;
  
    } catch (error) {
      console.error("Failed to delete game session:", error);
      return null;
    }
  }


