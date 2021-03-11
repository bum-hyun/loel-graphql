module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      html: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      html2: {
        type: DataTypes.STRING,
      },
      markdown: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      defaultScope: {
        rawAttributes: { exclude: ["deletedAt"] }
      },
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      paranoid: true,
      modelName: 'Post',
      tableName: 'posts',
      timestamps: true
    },
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: "email" })
    Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
  }

  return Post;
}
