import { Schema, model, Document } from 'mongoose';
import User from './User';

interface IGameSession extends Document {
  player: typeof User;
  score: number; 
}

// Define the schema for the Thought document
const GameSessionSchema = new Schema<IGameSession>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const GameSession = model<IGameSession>('GameSession', GameSessionSchema);

export default GameSession;
