const { gql } = require("apollo-server-express");

module.exports = gql`
  type Category {
    category: String!
    name: String!
    order: Int!
    parent: String
    isUse: Boolean!
  }
  
  extend type Query {
    getCategories: [Category!]
  }
`;
