const { Post } = require('../../database/models');

const { AuthenticationError, ApolloError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createComment(_, { content, postId }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a comment');
      }

      const post = await Post.findByPk(postId);

      if (post) {
        return post.createComment({ content, userId: user.id });
      }
      throw new ApolloError('Unable to create a comment');
    },
  },

  Comment: {
    user(comment) {
      return comment.getUser();
    },
    post(comment) {
      return comment.getPost();
    },
  },
};
