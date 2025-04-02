import { Thought, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('thoughts');
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username }).populate('thoughts');
        },
        thoughts: async () => {
            return await Thought.find().sort({ createdAt: -1 });
        },
        thought: async (_parent, { thoughtId }) => {
            return await Thought.findOne({ _id: thoughtId });
        },
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent, _args, context) => {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('thoughts');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
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
        addThought: async (_parent, { input }, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...input });
                await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { thoughts: thought._id } });
                return thought;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },
        addComment: async (_parent, { thoughtId, commentText }, context) => {
            if (context.user) {
                return Thought.findOneAndUpdate({ _id: thoughtId }, {
                    $addToSet: {
                        comments: { commentText, commentAuthor: context.user.username },
                    },
                }, {
                    new: true,
                    runValidators: true,
                });
            }
            throw AuthenticationError;
        },
        removeThought: async (_parent, { thoughtId }, context) => {
            if (context.user) {
                const thought = await Thought.findOneAndDelete({
                    _id: thoughtId,
                    thoughtAuthor: context.user.username,
                });
                if (!thought) {
                    throw AuthenticationError;
                }
                await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { thoughts: thought._id } });
                return thought;
            }
            throw AuthenticationError;
        },
        removeComment: async (_parent, { thoughtId, commentId }, context) => {
            if (context.user) {
                return Thought.findOneAndUpdate({ _id: thoughtId }, {
                    $pull: {
                        comments: {
                            _id: commentId,
                            commentAuthor: context.user.username,
                        },
                    },
                }, { new: true });
            }
            throw AuthenticationError;
        },
    },
};
export default resolvers;
