import { gql } from '@apollo/client';


export const QUERY_USERS = gql`
  query getUsers {
    users {
      username
      highScore
    }
  } 
`;

export const QUERY_GAME_SESSION = gql`
  query getGameSession($gameSessionId: ID!) {
    gameSession(gameSessionId: $gameSessionId) {
      _id
      player {
        _id
      }
      score
    }
  }
`;

export const QUERY_USERS_HIGH_SCORES = gql`
  query getUsersHighScores {
    users {
      _id
      username
      highScore
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      highScore
    }
  }
`;

export const QUERY_MULTIPLAYER_SESSION = gql`
  query getMultiplayerSession($multiplayerSessionId: ID!) {
    multiplayerSession(multiplayerSessionId: $multiplayerSessionId) {
      _id
      sessionId
    }
  }
`;

export const QUERY_MULTIPLAYER_SESSIONS = gql`
  query getMultiplayerSessions {
    multiplayerSessions {
      _id
      sessionId
    }
  }
`;