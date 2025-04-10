import React, { useEffect, useContext, useState } from "react";
import gameContext from "../../utils/gameContext.js";
import socketService from "../../services/socketService.js";
import gameService from "../../services/gameService.js";
import { useQuery } from "@apollo/client";
import { QUERY_MULTIPLAYER_SESSIONS } from "../../utils/queries.js";
import "../../styles/Multiplayer.css";

interface IJoinSessionProps {}

export function JoinSession(_props: IJoinSessionProps) {
  const [sessionName, setSessionName] = useState("");
  const [isJoining, setJoining] = useState(false);
  const [sessionList, setSessionList] = useState<string[]>([]);
  const { data, loading, refetch } = useQuery(QUERY_MULTIPLAYER_SESSIONS);
  //const { createMultiplayerSession } = useMutation(CREATE_MULTIPLAYER_SESSION);

  useEffect(() => {
    if (loading || !data) {
      return;
    }
    const tempSessionList = data.multiplayerSessions.map(
      (session: { sessionId: string }) => session.sessionId
    );
    setSessionList([...new Set<string>(tempSessionList)]);
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      automaticRefresh();
    }, 5000);
  }, []);

  const automaticRefresh = () => {
    refetch();
    setTimeout(() => {
      automaticRefresh();
    }, 5000);
  };

  const { setInSession } = useContext(gameContext);

  const handleSessionNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setSessionName(value);
  };

  const handleJoin = async (session: string): Promise<void> => {
    const socket = socketService.socket;
    if (!session || session.trim() === "" || !socket) {
      return;
    }

    setJoining(true);
    const joined = await gameService
      .joinGameSession(socket, session)
      .catch((err) => {
        alert(err);
      });
    if (joined) {
      setInSession(true);
    }

    setJoining(false);
  };

  const JoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin(sessionName);
  };

  return (
    <div className="session-forms">
      <div className="session-form">
        <h4>Enter Session Name to create a new game</h4>
        <form onSubmit={JoinSession} className="form-group">
          <input
            className="session-input"
            placeholder="Session Name"
            value={sessionName}
            onChange={handleSessionNameChange}
          />
          <button
            className="multiplayer-btn"
            type="submit"
            disabled={isJoining}
          >
            {isJoining ? "Joining..." : "Join"}
          </button>
        </form>
      </div>

      <div className="session-form">
        <h4>Join an Available Session</h4>
        <button className="multiplayer-btn" onClick={() => refetch()}>
          Refresh
        </button>
        <div className="session-list">
          {sessionList.map((session, index) => (
            <div
              className="session-item"
              onClick={() => handleJoin(session)}
              key={index}
            >
              {session}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
