const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      html: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      markdown: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        get() {
          const arr = this.getDataValue("image") ? this.getDataValue("image").split(",") : null;
          return arr;
        },
        set(value) {
          this.setDataValue("image", value ? value.join(",") : "");
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: "email", sourceKey: "email" });
    db.Post.belongsTo(db.Category, { foreignKey: "category", targetKey: "category" })
  }
};
