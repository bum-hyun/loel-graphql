const { Post } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createPost(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }
      return await Post.create({
        ...input
      });
    },
    async modifyPost(_, { id, input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to modify a post');
      }
      return await Post.update({
        ...input
      }, {
        where: { id }
      });
    },
    async removePost(_, { id }) {
      return await Post.destroy({ where: { id } });
    },
  },
  Query: {
    async getAllPosts(_, {},{ user = null }) {
      return await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 24
      });
    },
    async getCategoryPosts(_, { category }) {
      return await Post.findAll({
        offset: 0,
        limit: 20,
        where: { category },
        order: [['createdAt', 'DESC']],
      });
    },
    async getPost(_, { id }) {
      return await Post.findByPk(id);
    },
  },
  Post: {
    user(post) {
      return post.getUser();
    },
    // async comments(post) {
    //   return post.getComments();
    // }
  },
};
