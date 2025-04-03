import e from 'express';
import { GameSession, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js'; 

// Define types for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  _id: string;
  username: string;
  highScore: number;
}

interface GameSessionArgs {
  _id: string;
  player: UserArgs;
  score: number;
}

interface AddGameSessionArgs {
  input: {
    player: UserArgs;
    score: number;
  };
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    GameSession: async (_parent: any, { _id }: GameSessionArgs) => {
      return GameSession.findById(_id).populate('player');
    },
    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },

    updateUser: async (_parent: any, {...input }: GameSessionArgs, context: any) => {
      if(context.user) {

          //get user by id. This is the user assosicated with the game session
          const user = await User.findById(input.player._id);

          //if user not found, throw error
          if (!user) {
            throw new Error('User not found');
          }
          //check to see if the context user doesn't match the game session user
          if(context.user._id !== user._id) {
            throw new AuthenticationError('You are not authorized to update this user.');
          }
          //if there is a match, compare the scores
          else {
            //??? I'm not sure if this is the correct comparison.
            //compare the score from the game session to the highscore of the user
            if (input.score > user.highScore) {

              //if score is greater than highscore, update highscore
              //??? This is updating the user in as it is in the UserArgs. Not sure if I should be updating this or the context user eventhough they are the same.
              // await User.findOneAndUpdate(
              //   { _id: input.player._id },
              //   { highScore: input.score },
              //   { new: true }
              // );
              await User.findByIdAndUpdate(
                { _id: context.user._id },
                { highScore: input.score },
                { new: true }
              );
            }
          }
          
      }
      throw new AuthenticationError('Could not authenticate user.');  
    },


    addGameSession: async (_parent: any, { input }: AddGameSessionArgs, context: any) => {
      if (context.user) {
        // Create a new game session with the provided player and score
        // Score is set to 0 by default. This is done in the model.
        const gameSession = await GameSession.create({ ...input });
        return gameSession;
      }
      throw new AuthenticationError('Could not authenticate user.');
    },

  },
};

export default resolvers;
