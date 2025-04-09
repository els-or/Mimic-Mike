import { Schema, model, Document } from 'mongoose';

interface IMultiplayerSession extends Document {
  sessionId: string;
}

// Define the schema for the Thought document
const MultiplayerSessionSchema = new Schema<IMultiplayerSession>(
  {
    sessionId: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const MultiplayerSession = model<IMultiplayerSession>('MultiplayerSession', MultiplayerSessionSchema);

export default MultiplayerSession;
