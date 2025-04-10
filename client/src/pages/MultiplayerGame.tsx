import { useEffect, useState } from "react";
import socketService from "../services/socketService.js";

import { JoinSession } from "../components/MultiplayerGame/JoinSession.js";
import { IGameContextProps } from "../interfaces/MultiplayerGameContex.js";
import GameContext from "../utils/gameContext.js";
import { MultiplayerGameBoard } from "../components/MultiplayerGame/MultiplayerGameBoard.js";
import gameService from "../services/gameService.js";
import { MIKE } from "../components/MultiplayerGame/MIKE.js";
import { GameOver } from "../components/MultiplayerGame/GameOver.js";
import "../styles/Multiplayer.css";

const MultiplayerGame = () => {
  const [isInSession, setInSession] = useState(false);
  const [playerNumber, setPlayerNumber] = useState<0 | 1 | 2>(1);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [currentPattern, setCurrentPattern] = useState<string[]>([]);
  const [numOfFailures, setNumOfFailures] = useState(0);
  const [currentInput, setCurrentInput] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundState, setRoundState] = useState("");
  const [playerMessage, setPlayerMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [sessionList, setSessionList] = useState<string[]>([]);

  const connectSocket = async () => {
    let url = "http://localhost:3001";
    if (import.meta.env.MODE === "production") {
      url = "https://mimic-mike.onrender.com";
    }
    await socketService.connect(url).catch((err) => {
      console.log("Error: ", err);
    });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: IGameContextProps = {
    isInSession,
    setInSession,
    playerNumber,
    setPlayerNumber,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    currentTurn,
    setCurrentTurn,
    currentPattern,
    setCurrentPattern,
    numOfFailures,
    setNumOfFailures,
    currentInput,
    setCurrentInput,
    currentRound,
    setCurrentRound,
    roundState,
    setRoundState,
    playerMessage,
    setPlayerMessage,
    gameOver,
    setGameOver,
    sessionList,
    setSessionList,
  };

  const handleGameStart = () => {
    console.log("handle gamestart callback registered");
    if (socketService.socket) {
      gameService.onStartGame(socketService.socket, (options) => {
        console.log("game start options", options);
        setGameStarted(true);
        setPlayerNumber(options.player);
        setPlayerTurn(options.start);
        setCurrentPattern(options.startingPattern);
      });
    }
  };

  useEffect(() => {
    console.log("useEffect triggerd");
    handleGameStart();
  }, []);

  return (
    <GameContext.Provider value={gameContextValue}>
      <>
        <div className="mimic-mike-home"></div>
        <div className="content-wrapper">
          <div className="multiplayer-container">
            <h2 className="multiplayer-title">Play a game of M.I.K.E.</h2>

            <div className="multiplayer-info">
              {!isGameStarted && !isInSession && !gameOver ? (
                <p>Join a session to start a game!</p>
              ) : null}

              {isGameStarted && isInSession ? (
                <p>You are player {playerNumber}</p>
              ) : null}

              {!isGameStarted && isInSession ? (
                <p>Waiting for another player to join the game...</p>
              ) : null}

              {!gameOver ? (
                <p className="player-message">{playerMessage}</p>
              ) : null}
            </div>

            {!isInSession ? <JoinSession /> : null}
            {isInSession && !gameOver ? <MultiplayerGameBoard /> : null}
            {isInSession && gameOver ? (
              <GameOver victory={numOfFailures < 4} />
            ) : null}
            {isInSession && !gameOver ? <MIKE /> : null}
          </div>
        </div>
      </>
    </GameContext.Provider>
  );
};

export default MultiplayerGame;
