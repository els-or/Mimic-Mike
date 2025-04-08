import React from 'react'
import { IGameContextProps } from '../interfaces/MultiplayerGameContex.js'

const defaultState: IGameContextProps = {
    isInSession: false,
    setInSession: () => {},
    playerNumber: 0,
    setPlayerNumber: () => {},
    isPlayerTurn: false,
    setPlayerTurn: () => {},
    isGameStarted: false,
    setGameStarted: () => {},
    currentTurn: 0,
    setCurrentTurn: () => {},
    currentPattern: [],
    setCurrentPattern: () => {},
    numOfFailures: 0,
    setNumOfFailures: () => {},
    currentInput: [],
    setCurrentInput: () => {},
    currentRound: 0,
    setCurrentRound: () => {},
    roundState: "",
    setRoundState: () => {},
    playerMessage: "",
    setPlayerMessage: () => {},
    gameOver: false,
    setGameOver: () => {},
    sessionList: [],
    setSessionList: () => {},
}

export default React.createContext(defaultState)