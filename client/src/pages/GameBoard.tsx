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
  - remove redundancy between reset game and start game.
  - update the round number before the sequence plays so the user can see what round they are on.
  - alter code so game starts immediately after session is created.
  - force playSequence to stop immediately after reset.
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

  //State to block user input while the sequence is playing
  const [inputLocked, setInputLocked] = useState<boolean>(false);

  //State to check if the game is loading
  //TODO: verify if this is neccessary
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //State to designate which button is currently active (used for sound and styling for color/animation)
 const [activeButton, setActiveButton] = useState<string | null>(null);

  //FOR DEBUGGING GAME SESSIONS
  //console.log("Session ID:", gameSession?._id); //Log the session ID for debugging
  //console.log("Data:", data); //Log the data for debugging


  const handleCreateSession = async () => {
    console.log("---------------------")
    console.log("running handleCreateSession");
    console.log("---------------------\n")
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

 
  const startGame = () => {
    console.log("---------------------");
    console.log("running startGame");
    console.log("---------------------\n");
    
    setIsLoading(true);
    setGameSequence([]);
    setUserSequence([]);
    setScore(0);
    setRound(0);

    setInputLocked(false);

    setIsLoading(false);

    //Important: Do this last so the game UI sees a fully initialized state
    setGameStarted(true);
  };
  
  useEffect(() => {
    if(gameStarted){
      playSequence(); // Start the game sequence when the game starts
    }
  }, [gameStarted]); // Only run when gameStarted changes


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
    setInputLocked(true); // Lock input while sequence is playing
  
    newSequence.forEach((buttonId, index) => {
      const button = boardOneButtons.find((b) => b.id.toString() === buttonId);
      if (!button) return;
  
      const onTime = 1000 * index;
  
      // Light up the button and play the sound
      setTimeout(() => {
        //console.log(`Step ${index + 1}: ${button.text}`);
        console.log(`Seq ${index}: Playing ${button.sound} for button ${button.text}`); // Log the button text for debugging
        playSound(button.sound);
        setActiveButton(button.text);
      }, onTime);
  
      // Turn off the button after a short delay
      setTimeout(() => {
        setActiveButton(null);
      }, onTime + 600); // 600ms on, 400ms off before next
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
      startGame(); //This will be removed once the game is fully functional
      return;
    }
  
    console.log("CORRECT");
    
  
    //If this was the final correct input for the round
    if (updatedUserSequence.length === gameSequence.length) {
      console.log("Round complete!");
      // Optionally delay next round so it's not too abrupt
      setTimeout(() => {
        setScore((prev) => prev + 1); // Increment score
        setUserSequence([]); // reset input for the new round
        playSequence();      // begin next round
      }, 1000);
    }
  
    //console.log("User Sequence: ", updatedUserSequence);
    //console.log("Game Sequence: ", gameSequence);
  };


  
  
  
 
  return (
    <div>
    {gameStarted ? (
        <div>
        <h1>Game Session ID: {gameSession?._id}</h1>
        <p>Player ID: {gameSession?.player._id}</p>
        <p>Score: {score}</p>
        {/* Add your game logic here */}
        <div className="game-board">
            {boardOneButtons.map((button) => (
              <button
                key={button.id}
                //TODO: I want to set activeButton to the button's id value converted to a string, but I am not sure how to do that.
                style={{
                  backgroundColor: activeButton === button.text ? button.color[1]: button.color[0],
                  transition: "background-color 0.3s ease",
                  pointerEvents: inputLocked ? "none" : "auto", //Disable interaction while sequence is playing
                }}
                onClick={() => {
                  // Handle button click
                  console.log(`Button ${button.text} clicked`);
                  handlePlayerInput(button.id.toString());
                }}  
              >
                {button.text}
              </button>
            ))}
          {/*make a button to simulate moving on to the next round so the sequence can be tested.*/}
          <p>Game Sequence: {gameSequence.join(", ")}</p>
          <p>User Sequence: {userSequence.join(", ")}</p>
          <br />
          <p>round: {round}</p>
          <button onClick={playSequence}>Next Round</button>
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
              <button onClick={() => startGame()}>Start Game</button>
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
