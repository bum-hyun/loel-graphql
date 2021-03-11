module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent: {
        type: DataTypes.STRING,
      },
      class: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: DataTypes.STRING,
      postId: DataTypes.STRING,
    },
    {
      defaultScope: {
        rawAttributes: { exclude: ["deletedAt"] }
      },
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      paranoid: true,
      modelName: 'Comment',
      tableName: 'comments',
      timestamps: true
    }
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, { foreignKey: 'email' });
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  };
  return Comment;
};
