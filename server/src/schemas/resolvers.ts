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
          //get user by id
          const user = await User.findById(input.player._id);
          //if user not found, throw error
          if (!user) {
            throw new Error('User not found');
          }
          //compare the score from the game session to the highscore of the user
          if (input.score > user.highScore) {

          //if score is greater than highscore, update highscore
          await User.findOneAndUpdate(
            { _id: input.player._id },
            { highScore: input.score },
            { new: true }
          );
        }
      }
      else {
        throw new AuthenticationError('Could not authenticate user.');
      }
    }
  }
};

export default resolvers;
