//GAME SESSION import { useMutation } from "@apollo/client";
//GAME SESSION: import { CREATE_GAME_SESSION } from "../utils/mutations";
import { useEffect, useState } from "react";

import { boardOneButtons } from "../utils/buttonArray";
import { getRandomInt, playSound } from "../utils/gameLogicHelpers";
import GameOverScreen from "../components/Game/GameOverScreen";

/* **********TODOS**********
  - clean up code
  - try to find uniform test sounds 
  - consider changing conditional checks with buttons to use button.id for comparison instead of button.text
  - update the round number before the sequence plays so the user can see what round they are on.
  -add loading spinner
 */


const GameBoard = () => {

  //GAME SESSION: const [createGameSession, { loading, error }] = useMutation(CREATE_GAME_SESSION);

//#region State Variables
  //State to store the game session data

  //GAME SESSION: const [gameSession, setGameSession] = useState<{
  //   _id: string;
  //   player: { _id: string };
  //   score: number;
  // } | null>(null);

  //State to store the game's score (**NOTE: this is not the same as the score that is a part of createGameSession**)
  const [score, setScore] = useState(0); 

  //State to track if the game has started.
  const [gameStarted, setGameStarted] = useState(false);

  //State to track if the game is over.
  const [gameOver, setGameOver] = useState(false);

  //State to store the game sequence
  const [gameSequence, setGameSequence] = useState<string[]>([]); 

  //State to store the user's sequence
  const [userSequence, setUserSequence] = useState<string[]>([]); 
 
  //State to store the round that the game is currently on
  const [round, setRound] = useState<number>(0);

  //State to block user input while the sequence is playing
  const [inputLocked, setInputLocked] = useState<boolean>(false);

  //State to check if the game is loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //State to designate which button is currently active (used for sound and styling for color/animation)
 const [activeButton, setActiveButton] = useState<string | null>(null);

//#endregion State Variables

//#region Create Game Session
  
  //FOR DEBUGGING GAME SESSIONS
  //console.log("Session ID:", gameSession?._id); //Log the session ID for debugging
  //console.log("Data:", data); //Log the data for debugging


  //TODO: remove this and use the code from Home instead.
  //GAME SESSION: const handleCreateSession = async () => {
  //   console.log("---------------------")
  //   console.log("running handleCreateSession");
  //   console.log("---------------------\n")
  //   try{
  //     const { data } = await createGameSession({variables: { score: 0 } }); 

  //     //Set the game session state with the response data
  //     setGameSession(data.createGameSession);

  //     //Log the game session data for debugging
  //     console.log("Game session data:", data.createGameSession); 

  //     //update the score state with the initial score from the response
  //     setScore(data.createGameSession.score);

  //     //Log notification that game session was created.
  //     console.log("Game session created:", data.createGameSession);

  //   }catch (error) {
  //     console.error("Error creating game session:", error);
  //   }
  // };

//#endregion Create Game Session

//#region Game Start/Reset Functions
  const startOrResetGame = () => {
    console.log("---------------------");
    console.log("running startOrResetGame");
    console.log("---------------------\n");
    
    setIsLoading(true);
    setGameOver(false);
    setGameSequence([]);
    setUserSequence([]);
    setScore(0);
    setRound(0);

    setInputLocked(false);

    // Simulate a short delay to ensure all states are reset before proceeding
    setTimeout(() => {
      setIsLoading(false); // Mark loading as complete
      //Important: Do this last so the game UI sees a fully initialized state
    setGameStarted(true);
    }, 1000); // Adjust the delay as needed

  };

  useEffect(() => {
    console.log("useEffect triggered");
    console.log("isLoading:", isLoading);
    console.log("gameStarted:", gameStarted);
  
    if (!isLoading && gameStarted) {
      console.log("All states reset. Starting playSequence...");
      playSequence();
    }
  }, [isLoading, gameStarted]);

//#endregion Game Start/Reset Functions

//#region Game Over Functions
  const handlePlayAgain = () => {
    console.log("playing again")
    //TODO: Add code here to handle any changes that need to be made to the database session
    startOrResetGame();
  };

  const handleQuitGame = () => {
    //TODO: call a mutator to end the current game session
    //This reloads the current page
    window.location.reload(); 
  }
//#endregion Game Over Functions

//#region CPU Game Sequence Function
  const playSequence = () => {
    console.log("---------------------")
    console.log("playSequence STARTED");
    console.log("---------------------\n")
  
    const randomInt = getRandomInt(1, 4);
    const nextButton = boardOneButtons.find((b) => b.id === randomInt);
    if (!nextButton) {
      console.error("Invalid button");
      return;
    }
  
    const newSequence = [...gameSequence, nextButton.id.toString()];
    setGameSequence(newSequence);
    setInputLocked(true); //Lock input while sequence is playing
  
    newSequence.forEach((buttonId, index) => {
      const button = boardOneButtons.find((b) => b.id.toString() === buttonId);
      if (!button) return;
  
      const onTime = 1000 * index;
  
      // Light up the button and play the sound
      setTimeout(() => {
        console.log(`Seq ${index}: Playing ${button.sound} for button ${button.text}`); // Log the button text for debugging
        playSound(button.sound);
        setActiveButton(button.text);
      }, onTime);
  
      //Turn off the button after a short delay
      setTimeout(() => {
        setActiveButton(null);
      }, onTime + 600); //600ms on, 400ms off before next
    });
  
    // End of sequence — re-enable player input
    const totalTime = newSequence.length * 1000;
    setTimeout(() => {
      setInputLocked(false); //Unlock input after sequence is done
      setUserSequence([]);
      setRound((prev) => prev + 1);

      console.log("---------------------")
      console.log("playSequence FINISHED");
      console.log("---------------------\n")

    }, totalTime + 100);

  };
//#endregion CPU Game Sequence Function

//#region Player Input Function
  const handlePlayerInput = (buttonId: string) => {
    console.log("---------------------");
    console.log("running handlePlayerInput");
    console.log("---------------------\n");
  

    if (inputLocked) {
      console.log("Input ignored: user input is locked.");
      return;
    }

    if (userSequence.length >= gameSequence.length) {
      console.log("Input ignored: user already entered enough inputs.");
      return;
    }
  
    const button = boardOneButtons.find((b) => b.id.toString() === buttonId);
    if (!button) {
      console.error("Button not found");
      return;
    }
  
    const updatedUserSequence = [...userSequence, button.id.toString()];
    setUserSequence(updatedUserSequence);
  
    const currentIndex = updatedUserSequence.length - 1;
    const isCorrect = updatedUserSequence[currentIndex] === gameSequence[currentIndex];
  
    // Show feedback (sound & highlight)
    playSound(button.sound);
    setActiveButton(button.text);
    setTimeout(() => setActiveButton(null), 1000);
  
    if (!isCorrect) {
      console.log("INCORRECT");
      setInputLocked(true);
      setTimeout(() => {
        setGameOver(true);
      }, 2000); //update this to reflect the sound playback length
      return;
    }
  
    console.log("CORRECT");
    
  
    //If this was the final correct input for the round
    if (updatedUserSequence.length === gameSequence.length) {
      console.log("Round complete!");
      setTimeout(() => {
        setScore((prev) => prev + 1); //Increment score
        setUserSequence([]); //reset input for the new round
        playSequence();      //begin next round
      }, 1000);
    }
  };
//#endregion Player Input Function

  return (
    <div>
      {gameOver && <GameOverScreen score={score} onPlayAgain={handlePlayAgain} onQuit={handleQuitGame} />}

      {gameStarted ? (
        <div>
          <p>Score: {score}</p>
          <div className="game-board">
            {boardOneButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handlePlayerInput(button.id.toString())}
                //TODO: I want to set activeButton to the button's id value converted to a string, but I am not sure how to do that.
                style={{
                    backgroundColor: activeButton === button.text ? button.color[1]: button.color[0],
                    transition: "background-color 0.3s ease",
                    pointerEvents: inputLocked ? "none" : "auto", //Disable interaction while sequence is playing
                }}
              >
                {button.text}
              </button>
            ))}
            <p>Game Sequence: {gameSequence.join(", ")}</p>
            <p>User Sequence: {userSequence.join(", ")}</p>
            <br />
            <p>Round: {round}</p>
            <button onClick={playSequence}>Next Round</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={startOrResetGame}>Start Game</button>
          {/* GAME SESSION: <h1>Welcome to the Game!</h1>
          {!gameSession ? (
            <button onClick={handleCreateSession}>Create Game Session</button>
          ) : (
            <>
              <p>Game session created with ID: {gameSession._id}</p>
              <button onClick={startOrResetGame}>Start Game</button>
            </>
          )}
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>} */}
        </div>
      )}
    </div>
  );
}


export default GameBoard;
