const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    highScore: Int!
  }

  type GameSession {
    _id: ID
    player: User
    score: Int
  }

  input PlayerInput {
    _id: ID!
  }

  input GameSessionInput {
    _id: ID!
    player: PlayerInput!
    score: Int!
  }
  
  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    me: User
    gameSession(_id: ID!): GameSession
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    updateUser(_id: ID!, input: GameSessionInput!): User
    createGameSession(score: Int!): GameSession
    deleteGameSession(_id: ID!): GameSession
  }
`;

export default typeDefs;
