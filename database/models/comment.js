module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      paranoid: true,
      modelName: 'Comment',
      tableName: 'comments',
      timestamps: false
    }
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  };
  return Comment;
};
