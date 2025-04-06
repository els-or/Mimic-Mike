import { useMutation } from "@apollo/client";
import { CREATE_GAME_SESSION } from "../utils/mutations";
import { use, useEffect, useState } from "react";
//import PropTypes from "prop-types";
import { boardOneButtons } from "../utils/buttonArray";
import { getRandomInt, playSound } from "../utils/gameLogicHelpers";

/* **********TODOS**********
  - clean up code
  - read AI coding suggestions
  - try to find uniform test sounds 
  - configure the code to prevent user from clicking while game is playing
  - consider changing conditional checks with buttons to use button.id for comparison instead of button.text
 */


const GameBoard = () => {

  //!!! data is being used so its value should not be unread
  const [createGameSession, { data, loading, error }] = useMutation(CREATE_GAME_SESSION);

  //State to store the game session data
  const [gameSession, setGameSession] = useState<{
    _id: string;
    player: { _id: string };
    score: number;
  } | null>(null);

  //State to store the game's score (**NOTE: this is not the same as the score that is a part of createGameSession**)
  const [score, setScore] = useState(0); 

  //State to check if the game has started.
  const [gameStarted, setGameStarted] = useState(false);

  //State to store the game sequence
  const [gameSequence, setGameSequence] = useState<string[]>([]); 

  //State to store the user's sequence
  const [userSequence, setUserSequence] = useState<string[]>([]); 
 
  //State to store the round that the game is currently on
  const [round, setRound] = useState<number>(0);

  //State to check if the game pattern is being played (used to prevent player from interacting with any buttons until sequence has finished playing)
  const [sequencePlaying, setSequencePlaying] = useState<boolean>(false);

  //State to check if the game is loading
  //TODO: verify if this is neccessary
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //State to designate which button is currently active (used for sound and styling for color/animation)
 const [activeButton, setActiveButton] = useState<string | null>(null);

  //FOR DEBUGGING GAME SESSIONS
  //console.log("Session ID:", gameSession?._id); //Log the session ID for debugging
  //console.log("Data:", data); //Log the data for debugging


  const handleCreateSession = async () => {
    console.log("running handleCreateSession");
    try{
      const { data } = await createGameSession({variables: { score: 0 } }); 

      //Set the game session state with the response data
      setGameSession(data.createGameSession);

      //Log the game session data for debugging
      console.log("Game session data:", data.createGameSession); 

      //update the score state with the initial score from the response
      setScore(data.createGameSession.score);

      //Log notification that game session was created.
      console.log("Game session created:", data.createGameSession);

    }catch (error) {
      console.error("Error creating game session:", error);
    }
  };

  //create function that resets states between games
  const resetGame = async () => {
    console.log("running resetGame");

    setGameStarted(false);

    //??? Not sure if this is needed
    setIsLoading(true);

    setSequencePlaying(false);

    //reset gameSequence
    setGameSequence([]);
    
    //reset userSequence
    setUserSequence([]);

    //This is just the client-side score variable. It has nothing to do with GameSession score variable at this point in development
    setScore(0);

    setRound(0);

    setIsLoading(false);

    setGameStarted(true);
  }


  const startGame = () => {
    console.log("running startGame");
  
    setGameStarted(true);
    setIsLoading(true);
    setSequencePlaying(false);
    setGameSequence([]);
    setUserSequence([]);
    setScore(0);
    setRound(0);
  };
  

  //this method will randomly choose a button and trigger an animation after a short delay
  // const getNextInSequence = () => {
  //   console.log("running getNextInSequence");
  //   try{
  //         //call getRandomInt (from the gameLogicHelpers file) save the result to a variable
  //         //--- use 1 for the min and 4 for the max as there are 4 buttons.
  //         const randomInt = getRandomInt(1, 4);

  //         //use the Array find method() to find a button object in the buttonArray that has an id equal in value to the number returned by getRandomInt
  //         const button = boardOneButtons.find((button) => button.id === randomInt);
  //         //if the button is found, set the activeButton state to the button's text value and play the sound associated with that button
  //         if (button) {
  //             //add it to the gameSequence Array by calling setGameSequence
  //             setGameSequence((prevSequence) => [...prevSequence, button.text]);
  //         } else {
  //             throw new Error("Button not found");
  //         }

  //   }catch (error) {
  //       console.error("Error in getNextInSequence:", error);
  //   }
  // }

  const playSequence = () => {
    console.log("running playSequence");
    setSequencePlaying(true);
  
    const randomInt = getRandomInt(1, 4);
    const nextButton = boardOneButtons.find((b) => b.id === randomInt);
    if (!nextButton) {
      console.error("Invalid button");
      return;
    }
  
    const newSequence = [...gameSequence, nextButton.text];
    setGameSequence(newSequence);
  
    newSequence.forEach((buttonText, index) => {
      const button = boardOneButtons.find((b) => b.text === buttonText);
      if (button) {
          const delay = 1000 * index;

          // Set active state to highlight
          setTimeout(() => {
            playSound(button.sound);
            setActiveButton(button.text);
          }, delay);
      
          // Reset active state (e.g., after 900ms)
          setTimeout(() => {
            setActiveButton(null);
          }, delay + 900);
      }
    });
  
    setRound((prev) => prev + 1);
    setSequencePlaying(false);
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
                style={{
                  backgroundColor: activeButton === button.text ? button.color[1]: button.color[0],
                  transition: "background-color 0.3s ease"
                }}
                onClick={() => {
                  // Handle button click
                  console.log(`Button ${button.text} clicked`);
                  // Play sound here if needed
                  playSound(button.sound);
                }}  
              >
                {button.text}
              </button>
            ))}
          {/*make a button to simulate moving on to the next round so the sequence can be tested.*/}
          <p>Game Sequence: {gameSequence.join(", ")}</p>
          <br />
          <p>round: {round}</p>
          <button onClick={playSequence}>{gameSequence.length > 0 ? "Next Round" : "Start Sequence"}</button>
          <br />
          <button onClick={()=>{resetGame()}}>Reset Game</button>
          <br />
          <button onClick={() => setGameStarted(false)}>End Game</button>
          <br />
        </div>
    </div>
    ) : 
    (
      <div>
          <h1>Welcome to the Game!</h1>
          {!gameSession ? (
            <button onClick={handleCreateSession}>Create Game Session</button>
          ) : (
            <>
              <p>Game session created with ID: {gameSession._id}</p>
              <button onClick={startGame}>Start Game</button>
            </>
          )}
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
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
