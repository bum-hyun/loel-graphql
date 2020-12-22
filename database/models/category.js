const Sequelize = require('sequelize');

module.exports = class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      parent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isUse: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: 'Category',
      tableName: 'categories',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Category.hasMany(db.Post, { foreignKey: "category", targetKey: "category" });
  }
};
