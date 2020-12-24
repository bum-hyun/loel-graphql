const { Category } = require("../../database/models");

module.exports = {
  Query: {
    async getCategories() {
      return await Category.findAll({
        where: { isUse: true }
      });
    },
  },
}
