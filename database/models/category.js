module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isUse: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      paranoid: true,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: false
    },
  );

  Category.associate = (models) => {
    Category.hasMany(models.Post, { foreignKey: 'category' });
  }

  return Category;
}
