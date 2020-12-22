const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  type Post {
    id: String!
    email: String!
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
    getAllPosts: [Post!]
    getCategoryPosts: [Post!]
    getPost(id: String!): Post
  }
  
  extend type Mutation {
    createPost(title: String!, category: String!, title: String!, html: String!, markdown: String!, image: String!): CreatePostResponse
    modifyPost(id: String!, title: String!, category: String!, title: String!, html: String!, markdown: String!, image: String!): CreatePostResponse
    deletePost(id: String!): Int
  }
  
  type CreatePostResponse {
    id: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
  }
`;
