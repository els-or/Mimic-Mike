import { useContext, useEffect, useState } from "react";
import { MultiplayerGameButton } from "./MultiplayerGameButton";
import gameContext from "../../utils/gameContext";
import socketService from "../../services/socketService";
import gameService from "../../services/gameService";
import "../../styles/Multiplayer.css";

const wrongAudio = new Audio("/sounds/wrong.mp3");
wrongAudio.volume = 0.3;

interface ILightingList {
  green: boolean;
  red: boolean;
  yellow: boolean;
  blue: boolean;
}

let localGameOver = false;

const allLightsOff = {
  green: false,
  red: false,
  yellow: false,
  blue: false,
};

export function MultiplayerGameBoard() {
  const { playerNumber } = useContext(gameContext);
  const { isPlayerTurn, setPlayerTurn } = useContext(gameContext);
  const { currentRound, setCurrentRound } = useContext(gameContext);
  const { currentTurn, setCurrentTurn } = useContext(gameContext);
  const { currentPattern, setCurrentPattern } = useContext(gameContext);
  const { currentInput, setCurrentInput } = useContext(gameContext);
  const { numOfFailures, setNumOfFailures } = useContext(gameContext);
  const { roundState, setRoundState } = useContext(gameContext);
  const { isGameStarted } = useContext(gameContext);
  const { setPlayerMessage } = useContext(gameContext);
  const { gameOver, setGameOver } = useContext(gameContext);

  const [timerIdList, setTimerIdList] = useState<NodeJS.Timeout[]>([]);
  const [lightingList, setLightingList] = useState(allLightsOff);

  const handleClick = (color: string) => {
    const tempInput = [...currentInput];
    tempInput.push(color);
    if (!validateInput(tempInput)) {
      handlePlayerInputEnd(true);
    } else {
      const tempLightingList = { ...lightingList };
      tempLightingList[color as keyof ILightingList] = true;
      setLightingList(tempLightingList);
      setTimeout(() => {
        setLightingList(allLightsOff);
      }, 200);
      setCurrentInput(tempInput);
      if (tempInput.length === currentPattern.length) {
        handlePlayerInputEnd(false);
      }
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, {
        light: {
          color: color,
        },
        player: playerNumber,
      });
    }
  };

  const handlePlayerInputEnd = (failure: boolean) => {
    console.log("handlePlayerInputEnd called");
    if (failure) {
      wrongAudio.play();
      setPlayerMessage(
        "You didn't follow the pattern! You're going to get a letter!"
      );
      setNumOfFailures(numOfFailures + 1);
    } else {
      setPlayerMessage("Great job! You followed the pattern!");
    }
    const tempTimer = setTimeout(() => {
      if (currentTurn === 1 && !localGameOver) {
        handlePlayerSwap();
      } else if (!localGameOver) {
        handleRoundChange();
      }
    }, 2000);
    const tempTimerList = [...timerIdList, tempTimer];
    setTimerIdList(tempTimerList);
  };

  useEffect(() => {
    console.log("gameOver", gameOver);
    console.log("timerIdList", timerIdList);
    console.log("localGameOver", localGameOver);
    if (gameOver || localGameOver) {
      for (let i = 0; i < timerIdList.length; i++) {
        clearTimeout(timerIdList[i]);
      }
      setTimerIdList([]);
    }
  }, [gameOver, timerIdList, roundState, localGameOver]);

  const handlePlayerSwap = () => {
    console.log("handlePlayerSwap called");
    setCurrentInput([]);
    setCurrentTurn(2);
    setPlayerTurn(!isPlayerTurn);
    setRoundState("startingTurn");
    handleTurnStart();
    if (socketService.socket) {
      gameService.updateGame(socketService.socket, {
        playerSwap: true,
      });
    }
  };

  const handleRoundChange = () => {
    console.log("handleRoundChange called");
    if (numOfFailures >= 4) {
      setRoundState("gameOver");
    } else {
      setCurrentInput([]);
      setCurrentTurn(1);
      setPlayerTurn(false);
      setCurrentRound(currentRound + 1);
      setRoundState("startingTurn");
      handleTurnStart();
      if (socketService.socket) {
        gameService.updateGame(socketService.socket, {
          roundEnd: true,
          round: currentRound + 1,
          player: playerNumber,
        });
      }
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, (gameInfo) => {
        if (gameInfo.light && gameInfo.light.color) {
          const tempLightingList = { ...lightingList };
          tempLightingList[gameInfo.light.color as keyof ILightingList] = true;
          setLightingList(tempLightingList);
          setTimeout(() => {
            setLightingList(allLightsOff);
          }, 200);
        }
        if (gameInfo.roundEnd) {
          console.log("round end message received");
          setCurrentInput([]);
          setCurrentTurn(1);
          setPlayerTurn(true);
          setCurrentRound(gameInfo.round);
          setRoundState("startingTurn");
          console.log("gameInfo", gameInfo);
          handleTurnStart();
        }
        if (gameInfo.newPattern) {
          console.log("new pattern message received");
          setCurrentPattern(gameInfo.newPattern);
        }
        if (gameInfo.playerSwap && !gameOver) {
          console.log("player swap message received");
          setPlayerTurn(!isPlayerTurn);
          setCurrentTurn(2);
          setCurrentInput([]);
          setRoundState("startingTurn");
        }
        if (gameInfo.gameOver) {
          console.log("game over message received");
          if (gameInfo.losingPlayer == playerNumber) {
            setPlayerMessage("Game Over! You have spelled M.I.K.E. and lost!");
          } else {
            setPlayerMessage("Game Over! You have won!");
          }
          setRoundState("gameOver");
          setGameOver(true);
          localGameOver = true;

          setTimeout(() => {
            if (socketService.socket) {
              socketService.socket.disconnect();
            }
          }, 2000);
        }
      });
    }
  };

  const handleRoundStart = () => {
    console.log("handleRoundStart called");
    if (numOfFailures >= 4) {
      setRoundState("gameOver");
      if (socketService.socket) {
        gameService.updateGame(socketService.socket, {
          gameOver: true,
          losingPlayer: playerNumber,
        });
      }
    } else {
      if (roundState == "") {
        setRoundState("startingTurn");
      }
      if (roundState != "gameOver") {
        handleTurnStart();
      }
    }
  };

  const handleTurnStart = () => {
    if (roundState === "startingTurn" && isGameStarted && isPlayerTurn) {
      setRoundState("playingPattern");
      playPattern(currentPattern);
    }
    if (roundState === "startingTurn" && isGameStarted && !isPlayerTurn) {
      setRoundState("waitingForTurn");
      setPlayerMessage("Waiting for your turn...");
    }
  };

  useEffect(() => {
    console.log("handleRoundStart called");
    console.log("roundState", roundState);
    handleRoundStart();
  }, [isGameStarted, isPlayerTurn, roundState]);
  useEffect(() => {
    handleGameUpdate();
  }, []);

  const playPattern = (pattern: string[]) => {
    let tempTimerList = [];
    let tempTimer = null;
    console.log("playPattern called");
    for (let i = 0; i < 4; i++) {
      tempTimer = setTimeout(() => {
        setPlayerMessage(`Watch the pattern! Starting in ${3 - i} seconds...`);
      }, 1000 * i);
      tempTimerList.push(tempTimer);
    }
    tempTimer = setTimeout(() => {
      setPlayerMessage("Watch the pattern!");
    }, 4000);
    tempTimerList.push(tempTimer);
    tempTimer = setTimeout(() => {
      pattern.forEach((color, index) => {
        setTimeout(() => {
          const tempLightingList = { ...lightingList };
          tempLightingList[color as keyof ILightingList] = true;
          setLightingList(tempLightingList);
          if (socketService.socket) {
            gameService.updateGame(socketService.socket, {
              light: {
                color: color,
              },
              player: playerNumber,
            });
          }
          setTimeout(() => {
            setLightingList(allLightsOff);
          }, 200);
        }, index * 800);
      });
      setTimeout(() => {
        setLightingList(allLightsOff);
        setPlayerMessage("Repeat the pattern!");
        setRoundState("waitingForInput");
      }, (pattern.length + 1) * 800);
    }, 4000);
    tempTimerList.push(tempTimer);
    setTimerIdList(tempTimerList);
  };

  const validateInput = (input: string[]) => {
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== currentPattern[i]) {
        return false;
      }
    }
    return true;
  };

  return (
    <div>
      <div className="simon-container multiplayer-simon">
        <MultiplayerGameButton
          color="green"
          lit={lightingList.green}
          handleClick={handleClick}
        />
        <MultiplayerGameButton
          color="red"
          lit={lightingList.red}
          handleClick={handleClick}
        />
        <MultiplayerGameButton
          color="yellow"
          lit={lightingList.yellow}
          handleClick={handleClick}
        />
        <MultiplayerGameButton
          color="blue"
          lit={lightingList.blue}
          handleClick={handleClick}
        />
        <div className="simon-center">
          <div className="round-display">{currentRound}</div>
        </div>
      </div>
    </div>
  );
}
