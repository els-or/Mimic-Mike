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
