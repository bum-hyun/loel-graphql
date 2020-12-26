const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => { 
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      defaultScope: {
        rawAttributes: { exclude: ["password"] }
      },
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      paranoid: true,
      modelName: 'User',
      tableName: 'users',
      timestamps: false
    },
  );

  User.generatePasswordHash = async (password) => {
    if (password) {
      return await bcrypt.hash(password, 10);
    }
  };
  
  User.beforeCreate(async (user) => {
    user.password = await User.generatePasswordHash(user.password);
  });
  
  User.associate = (models) => { 
    User.hasMany(models.Post, { foreignKey: "email" })
  }
  
  return User;
}
