const { User, Book} = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks');
              return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('savedBooks');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username :username })
                .select('-__v -password')
                .populate('savedBooks');
        },
        meetings: async () => {
            return Meeting.find()
                .select('-__v')
                .populate('invitees')
                .populate('host')
                .populate('recordKeeper');
        },
        meeting: async (parent, { _id }) => {
            return Meeting.findById({ _id })
                .select('-__v' )
                .populate('invitees')
                .populate('host')
                .populate('recordKeeper');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
        
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
        
            const correctPw = await user.isCorrectPassword(password);
            
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, {bookInput}, context) => {
            if (context.user) {
                return updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookInput} },
                    { new: true })
                    .select('-__v -password')
                    .populate('savedBooks');
            }
        },
        removeBook: async (parent, {id}, context) => {
            if (context.user) {
                return updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: id} } },
                    { new: true })
                    .select('-__v -password')
                    .populate('savedBooks');
            }
        }
    }
  };
  
  module.exports = resolvers;