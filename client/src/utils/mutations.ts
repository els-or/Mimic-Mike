import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const UPDATE_USER = gql`
  mutation updateUser($_id: ID!, $input: GameSessionInput!) {
    updateUser(_id: $_id, input: $input) {
      _id
      highScore
    }
  }
`;


export const CREATE_GAME_SESSION = gql`
  mutation createGameSession($score: Int!) {
    createGameSession(score: $score) {
      _id
      player {
        _id
      }
      score
    }
  }
`;


export const DELETE_GAME_SESSION = gql`
  mutation deleteGameSession($_id: ID!) {
    deleteGameSession(_id: $_id) {
      _id
    }
  }
`;
