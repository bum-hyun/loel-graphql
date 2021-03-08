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
      const it = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "it" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      const food = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "food" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      const investment = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "investment" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      const life = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "life" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      return [
        {label: "it", items: it},
        {label: "food", items: food},
        {label: "investment", items: investment},
        {label: "life", items: life},
      ];
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
  },
};
