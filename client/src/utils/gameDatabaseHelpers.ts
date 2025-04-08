import { ApolloClient } from "@apollo/client";
import { CREATE_GAME_SESSION, UPDATE_USER } from "../utils/mutations";
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

export async function updateUserScore(client: ApolloClient<any>, gameSession: GameSession): Promise<UserData | null>{
    try{
        console.log("CLIENT = ", client);
        console.log("GAME SESSION = ", gameSession);

        
        const { data } = await client.mutate({
            mutation: UPDATE_USER,
            variables: {
                _id: gameSession.player._id,  // This is the player ID
                input: {
                    score: gameSession.score,  // Score from the game session
                },
            },
        });

        //Return the updated user or null if no user is returned
        return data.updateUser || null;

    }catch(error){
        console.error("Failed to update user:", error);
        return null; // Return null on failure to update the user
    }
}
