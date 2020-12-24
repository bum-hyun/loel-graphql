const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  type Post {
    id: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
    image: [String]
    createdAt: Date
    updatedAt: Date
    user: Author
  }
  
  extend type Query {
    getAllPosts: [CategoryPostResponse!]
    getCategoryPosts(category: String!): [Post!]
    getPost(id: String!): Post
  }
  
  extend type Mutation {
    createPost(title: String!, category: String!, title: String!, html: String!, markdown: String!, image: String!): PostResponse
    modifyPost(id: String!, title: String!, category: String!, title: String!, html: String!, markdown: String!, image: String!): PostResponse
    removePost(id: String!): String
  }
  
  type PostResponse {
    id: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
    image: [String]
  }
  
  type CategoryPostResponse {
    label: String!
    items: [Post]
  }
`;
