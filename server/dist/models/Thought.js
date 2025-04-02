import { Schema, model } from 'mongoose';
// Define the schema for the Comment subdocument
const commentSchema = new Schema({
    commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
}, {
    _id: false,
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
});
// Define the schema for the Thought document
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
        trim: true,
    },
    thoughtAuthor: {
        type: String,
        required: true,
        trim: true,
    },
    comments: [commentSchema],
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Thought = model('Thought', thoughtSchema);
export default Thought;
