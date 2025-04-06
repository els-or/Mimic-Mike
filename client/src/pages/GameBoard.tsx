import { useMutation } from "@apollo/client";
import { CREATE_GAME_SESSION } from "../utils/mutations";
import { use, useEffect, useState } from "react";
//import PropTypes from "prop-types";
import { boardOneButtons } from "../utils/buttonArray";
import { getRandomInt } from "../utils/gameLogicHelpers";

//??? see if you can pass in an array of button objects
const GameBoard = () => {
  const [createGameSession, { data, loading, error }] = useMutation(CREATE_GAME_SESSION);
  // State to store the game session data
  const [gameSession, setGameSession] = useState<{
    _id: string;
    player: { _id: string };
    score: number;
  } | null>(null);
  const [score, setScore] = useState(0); // Initialize score state
  //create state to check if the game is started
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSequence, setGameSequence] = useState<string[]>([]); // State to store the game sequence
  const [userSequence, setUserSequence] = useState<string[]>([]); // State to store the user's sequence
 
  const [round, setRound] = useState<number>(0);
  //create a state to check if the game pattern is being played
  const [sequencePlaying, setSequencePlaying] = useState<boolean>(false);
  //create a state to check if the game is loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

 const [activeButton, setActiveButton] = useState<string | null>(null);

  console.log("Session ID:", gameSession?._id); // Log the session ID for debugging
  console.log("Data:", data); // Log the data for debugging


  const handleCreateSession = async () => {
    console.log("running handleCreateSession");
    try{
      const { data } = await createGameSession({variables: { score: 0 } });
      setGameSession(data.createGameSession); // Set the game session state with the response data
      console.log("Game session data:", data.createGameSession); // Log the game session data for debugging
      //update the score state with the initial score from the response
      setScore(data.createGameSession.score);
      console.log("Game session created:", data.createGameSession);
      resetGame(); // Call resetGame after creating the session
    }catch (error) {
      console.error("Error creating game session:", error);
    }
  };

  //create function that resets states between games
  const resetGame = async () => {
    console.log("running resetGame");
    //if gameStarted is true
    if (gameStarted) {
        //set gameStarted to false
        setGameStarted(false);
    }
    
    //if loading is false
    if (!isLoading) {
        //set loading to true
        setIsLoading(true);
    }

    //make sure Sequence playing is false
    setSequencePlaying(false);

    //reset gameSequence
    setGameSequence([]);
    
    //reset userSequence
    setUserSequence([]);

    //reset score
    setScore(0);

    //set round to 0
    setRound(0);

    //set loading to false
    setIsLoading(false);

    //set gameStarted to true
    setGameStarted(true);

    setTimeout(() => {
      playSequence(); // Call playSequence to start the game
    }, 1000); // Delay execution by 1 second
  }

  //this method will randomly choose a button and trigger an animation after a short delay
  const getNextInSequence = () => {
    console.log("running getNextInSequence");
    try{
          //call getRandomInt (from the gameLogicHelpers file) save the result to a variable
          //--- use 1 for the min and 4 for the max as there are 4 buttons.
          const randomInt = getRandomInt(1, 4);

          //use the Array find method() to find a button object in the buttonArray that has an id equal in value to the number returned by getRandomInt
          const button = boardOneButtons.find((button) => button.id === randomInt);
          //if the button is found, set the activeButton state to the button's text value and play the sound associated with that button
          if (button) {
              //add it to the gameSequence Array by calling setGameSequence
              setGameSequence((prevSequence) => [...prevSequence, button.text]);
          } else {
              throw new Error("Button not found");
          }

    }catch (error) {
        console.error("Error in getNextInSequence:", error);
    }
  }

  const playSequence = () => {
    //if(loading) return; // Prevent playing sequence if loading
    console.log("running playSequence");
    //set sequencePlaying to true
    setSequencePlaying(true);
    //call getNextInSequence to add a button to the gameSequence array
    getNextInSequence();
    //TODO: fix issue with the game needing to be reset after the first round
    //use the gameSequence array to play the sounds for each button in the sequence
    //use the forEach method to loop through the gameSequence array and play the sound associated with each button
    gameSequence.forEach((buttonText, index) => {
        //find the button object in the buttonArray that has a text value equal to the buttonText value
        const button = boardOneButtons.find((button) => button.text === buttonText);
        //if the button is found, play the sound associated with that button after a delay of 1 second multiplied by the index of the button in the gameSequence array
        if (button) {
            setTimeout(() => {
                console.log(`Playing sound for ${button.text}`);
                //playSound(button.sound); // Uncomment this line to play the sound
                setActiveButton(button.text); // Set activeButton state to highlight the button
            }, 1000 * index);
        }
    });  
    console.log("gameSequence:", gameSequence); // Log the game sequence for debugging
    //increment round by one
    setRound((prevRound) => prevRound + 1);
    //set sequencePlaying to false
    setSequencePlaying(false);
  }



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
                    style={{ backgroundColor: button.color }}
                    onClick={() => {
                        // Handle button click
                        console.log(`Button ${button.text} clicked`);
                        // Play sound here if needed
                    }}
                >
                    {button.text}
                </button>
            ))}
          {/*make a button to simulate moving on to the next round so the sequence can be tested.*/}
          <br />
          <p>round: {round}</p>
          <button onClick={playSequence}>Next Round</button>
          <br />
          <button onClick={resetGame}>Reset Game</button>
          <br />
          <button onClick={() => setGameStarted(false)}>End Game</button>
          <br />
        </div>
    </div>
    ) : 
    (
    <div>
        <h1>Welcome to the Game!</h1>
        <button onClick={resetGame}>Start New Game Session</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && <p>Game session created with ID: {data.createGameSession._id}</p>}
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
