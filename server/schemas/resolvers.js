const { User, Book} = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { isInputObjectType } = require('graphql');

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
        saveBook: async (parent, {bookId, title, authors, description, image, link}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: { bookId: bookId, title: title, authors: authors, description: description, image: image, link: link } } },
                    { new: true, runValidators: true  })
                    .select('-__v -password')
                    .populate('savedBooks');

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                return updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId} } },
                    { new: true, upsert: true})
                    .select('-__v -password')
                    .populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
  };
  
  module.exports = resolvers;