//Libraries
import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Utility files
import { createGameSession } from "../utils/gameDatabaseHelpers";
import { boardOneButtons } from "../utils/buttonArray";
import { getRandomInt, playSound } from "../utils/gameLogicHelpers";

//Interfaces
import { GameSession } from "../interfaces/GameSession";

//Components
import GameOverScreen from "../components/Game/GameOverScreen";

/* **********TODOS**********
  - clean up code
  - try to find uniform test sounds 
  - consider changing conditional checks with buttons to use button.id for comparison instead of button.text
  - update the round number before the sequence plays so the user can see what round they are on.
  -add loading spinner
 */


const GameBoard = () => {

  const navigate = useNavigate();

//#region State Variables

  //State to store and track the game session
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

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

  const client = useApolloClient();

  useEffect(() => {
    console.log("---------------------------");
    console.log("CLIENT USE EFFECT TRIGGERED");
    console.log("---------------------------\n");
    //TODO: make sure generateSession is used
    const generateSession = async () => {
      const session = await createGameSession(client);
      if(session){
        console.log('New game session:', session);
        //Store the session in state
        setGameSession(session);
      }else{
        console.error("Failed to create game session.");
        //TODO: Handle the failure case (e.g., show an error message or retry)
      }
    };

    if(!gameSession){
      //!!! WARNING: This could loop repeatedly if it continues to fail when communicating with the DB
      //TODO: Improve this so it will stop if it fails to get the data too many times
      generateSession();
    }
    
    startOrResetGame();
  },[client, gameSession]);
  
//#endregion Create Game Session

//#region Game Start/Reset Functions
  const startOrResetGame = () => {
    console.log("---------------------");
    console.log("running startOrResetGame");
    console.log("---------------------\n");
    try{
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
  
    }catch(error){
      console.error("Unable to create game session: ", error);
      //TODO: make an error modal??
      //TODO: add something here to offer a way to retry creating a game session
    }
    
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
  const handlePlayAgain = async() => {
    console.log("playing again")
    //TODO: Update user 
    //TODO: call a mutator to end the current game session
      // Create a new game session
      const session = await createGameSession(client);
      setGameSession(session); // Store the new session
  };

  const handleQuitGame = async() => {
    //TODO: update user
    //TODO: call a mutator to end the current game session
    console.log("game over, returning to home page");
    navigate("/");
    

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

      {isLoading ? (
        // TODO: replace with something nicer looking.
        <p>LOADING...</p>
      ) : (
        gameStarted && (
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
        )        
      )}

    </div>
    
  );
}


export default GameBoard;
