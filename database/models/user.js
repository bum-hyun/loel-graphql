const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    }, {
      sequelize,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      paranoid: true,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    });
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: "email", targetKey: "email" });
  }
};
