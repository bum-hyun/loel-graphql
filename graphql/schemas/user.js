const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    name: String!
    email: String!
    password: String!
  }
  
  type Author {
    name: String!
    email: String!
  }
  
  extend type Mutation {
    register(input: RegisterInput!): RegisterResponse
    login(input: LoginInput!): LoginResponse
  }
  
  type RegisterResponse {
    name: String!
    email: String!
  }
  
  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }
  
  input LoginInput {
    email: String!
    password: String!
  }
  
  type LoginResponse {
    name: String!
    email: String!
    token: String!
  }
`;
