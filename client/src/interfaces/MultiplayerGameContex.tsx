export interface IGameContextProps {
  isInSession: boolean;
  setInSession: (inSession: boolean) => void;
  playerNumber: 0 | 1 | 2;
  setPlayerNumber: (number: 0 | 1 | 2) => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  currentTurn: number;
  setCurrentTurn: (turn: number) => void;
  currentPattern: string[];
  setCurrentPattern: (pattern: string[]) => void;
  numOfFailures: number;
  setNumOfFailures: (failures: number) => void;
  currentInput: string[];
  setCurrentInput: (input: string[]) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  roundState: string;
  setRoundState: (state: string) => void;
  playerMessage: string;
  setPlayerMessage: (message: string) => void;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
  sessionList: string[];
  setSessionList: (sessionList: string[]) => void;
}
