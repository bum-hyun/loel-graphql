const { Post, Comment } = require('../../database/models');

const { AuthenticationError, ApolloError } = require('apollo-server-express');

module.exports = {
  Query: {
    async getComments(_, { postId }) {
      console.log(postId)
      return await Comment.findAll({
        where: { postId },
        order: [["createdAt", "DESC"]]
      })
    },
  },
  Mutation: {
    async createComment(_, { comment, postId, email }, { user = null }) {

      const post = await Post.findByPk(postId);

      if (post) {
        return Comment.create({ ...comment, postId, email: user ? user.email : "" });
      }
      throw new ApolloError('Unable to create a comment');
    },
  },

  Comment: {
  },
};
