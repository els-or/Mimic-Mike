import React, { useContext, useState } from "react";
import gameContext from "../../utils/gameContext.js";
import socketService from "../../services/socketService.js";
import gameService from "../../services/gameService.js";

interface IJoinSessionProps {}

export function JoinSession(_props: IJoinSessionProps) {
  const [sessionName, setSessionName] = useState("");
  const [isJoining, setJoining] = useState(false);

  const { setInSession } = useContext(gameContext);

  const handleSessionNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setSessionName(value);
  };

  const JoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!sessionName || sessionName.trim() === "" || !socket) {
      return;
    }
    setJoining(true);

    const joined = await gameService
      .joinGameSession(socket, sessionName)
      .catch((err) => {
        alert(err);
      });

    if (joined) {
      setInSession(true);
    }

    setJoining(false);
  };

  return (
    <div>
      <form onSubmit={JoinSession}>
        <div>
          <h4>Enter Session ID to join Game</h4>
          <input
            placeholder="Session ID"
            value={sessionName}
            onChange={handleSessionNameChange}
          />
          <button type="submit" disabled={isJoining}>
            {isJoining ? "Joining..." : "Join"}
          </button>
        </div>
      </form>
    </div>
  );
}
