//import e from 'express';
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


interface GameSessionArgs {
  _id: string;
  player: {
    _id: string;
    username: string;
  };
  score: number;
}

interface GameSessionInput {
  _id: string;
  player: {
    _id: string;
    username: string;
  };
  score: number;
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    gameSession: async (_parent: any, { _id }: GameSessionArgs) => {
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

    updateUser: async (_parent: any, { input }: { input: GameSessionInput }, context: any) => {
      console.log("*******UPDATE USER TRIGGERED*********  ", context);
      if(context.user) {
          console.log('Updating user with game session:', input);
          console.log('Game session ID:', input._id);
          console.log('Game session player ID:', input.player._id);
         
            const user = await User.findById(context.user._id).select('highScore');
        
          // //if user not found, throw error
          if (!user) {
            throw new Error('User not found');
          }
          console.log('\nuser current highscore:', user.highScore);

          console.log(' \n context user id:', context.user._id);
          console.log('input player id:', input.player._id);
     
          //check to see if the context user doesn't match the game session user
          if(context.user._id !== input.player._id) {
            throw new AuthenticationError('You are not authorized to update this user.');
          }
          else {
            //compare the score from the game session to the highscore of the user
            console.log('Comparing scores...');
            console.log('Game session score:', input.score);
            console.log('User high score:', user.highScore);

            if (input.score > user.highScore) {
                console.log('New high score:', input.score);
                console.log('Old high score:', user.highScore);
                
                //if score is greater than highscore, update highscore
                const updatedUser = await User.findByIdAndUpdate(
                  { _id: context.user._id },
                  { highScore: input.score },
                  { new: true }
                );

                return updatedUser; //return the updated user
            }
          }
          return user; //return the user if no update is needed
      }
      else{
        throw new AuthenticationError('Could not authenticate user.');  
      }
      
    },


    createGameSession: async (_parent: any, { score }: { score: number }, context: any) => {
      //Ensusure the user is authenticated
      if(!context.user) {
        throw new AuthenticationError('You need to be logged in to create a game session!');
      }

      try{
        console.log('Creating game session for user:', context.user._id);
        console.log("user information:", context.user);
        console.log('Score:', score);
        //create a new game session with the logged in user as the player
        const newGameSession = await GameSession.create({
          player: context.user._id, //use the authenticated user's id
          //TODO: figure out how to get the username from the context user
          //player: context.user.username, //use the authenticated user's username
          score, //??? Should this be score: score? Or is this correct?
        });

        return newGameSession; //return the new game session
      }catch (error) {
        console.error('Error creating game session:', error);
        throw new Error('Failed to create game session');
      }
    },

  },
};

export default resolvers;
