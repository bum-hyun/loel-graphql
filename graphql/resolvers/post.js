const { Post } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createPost(_, { email, category, title, html, markdown, image }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }
      return Post.create({
        email,
        category,
        title,
        html,
        markdown,
        image
      });
    },
  },
  Query: {
    async getAllPosts(root, args, context) {
      return Post.findAll({      
        offset: 0,
        limit: 8
      });
    },
    async getSinglePost(_, { postId }, context) {
      return Post.findByPk(postId);
    },
  },
  Post: {
    user(post) {
      return post.getUser();
    },
    comments(post) {
      return post.getComments();
    },
  },
};
