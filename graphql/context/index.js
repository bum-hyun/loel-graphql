const { User } = require('../../database/models');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const verifyToken = async (token) => {
  try {
    if (!token) return null;
    const { email } = await jwt.verify(token, process.env.JWT_SECRET);
    return await User.findByPk(email);
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

module.exports = async ({ req }) => {
  const token = (req.headers && req.headers.authorization) || '';
  console.log("token", token)
  const user = await verifyToken(token)
  return { user };
};
