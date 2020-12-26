const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AuthenticationError } = require('apollo-server-express');

const { User } = require("../../database/models");

module.exports = {
  Mutation: {
    async register(root, { input }, context) {
      const { name, email, password } = input;
      return await User.create({ name, email, password });
    },
    
    async login(root, { input }, context) {
      const { email, password } = input;
      const user = await User.findOne({ where: { email }});
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        return { ...user.toJSON(), token };
      }
      throw new AuthenticationError("Invalid credentials");
    },
  },
}
