const { Post } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createPost(_, { email, category, title, html, markdown, image }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }
      return await Post.create({
        email,
        category,
        title,
        html,
        markdown,
        image
      });
    },
    async removePost(_, { id }) {
      return await Post.destroy({ where: { id } });
    }
  },
  Query: {
    async getAllPosts() {
      const chocolate = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "chocolate" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      const strawberry = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "strawberry" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      const vanilla = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "vanilla" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      const coding = await Post.findAll({
        attributes: {
          exclude: ["deletedAt"],
        },
        where: { category: "coding" },
        order: [['createdAt', 'DESC']],
        offset: 0,
        limit: 8
      });
      return [
        {label: "chocolate", items: chocolate},
        {label: "strawberry", items: strawberry},
        {label: "vanilla", items: vanilla},
        {label: "coding", items: coding},
      ];
    },
    async getCategoryPosts(_, { category }) {
      return await Post.findAll({
        offset: 0,
        limit: 20,
        where: { category }
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
