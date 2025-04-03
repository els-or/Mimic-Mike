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

// Ensure that GameSessionInput is defined in your GraphQL schema and matches the expected input structure.


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


//These are just for reference and will not be part of the final code
export const ADD_THOUGHT = gql`
  mutation AddThought($input: ThoughtInput!) {
    addThought(input: $input) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($thoughtId: ID!, $commentText: String!) {
    addComment(thoughtId: $thoughtId, commentText: $commentText) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;
