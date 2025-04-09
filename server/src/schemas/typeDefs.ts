const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    highScore: Int!
  }

  type MultiplayerSession {
    _id: ID
    sessionId: String
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

  input MultiplayerSessionInput {
    _id: ID!
    sessionId: String!
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
    multiplayerSession(_id: ID!): MultiplayerSession
    multiplayerSessions: [MultiplayerSession]
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    updateUser(_id: ID!, input: GameSessionInput!): User
    createGameSession(score: Int!): GameSession
    deleteGameSession(_id: ID!): GameSession
    createMultiplayerSession(sessionId: String!): MultiplayerSession
    deleteMultiplayerSession(_id: ID!): MultiplayerSession
  }
`;

export default typeDefs;
