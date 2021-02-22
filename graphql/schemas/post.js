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
  
  input CreatePostInput {
    email: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
    image: [String]
  }
  
  input ModifyPostInput {
    email: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
    image: [String]
  }
  
  extend type Query {
    getAllPosts: [CategoryPostResponse!]
    getCategoryPosts(category: String!): [Post!]
    getPost(id: String!): Post
  }
  
  extend type Mutation {
    createPost(input: CreatePostInput!): PostResponse
    modifyPost(id: String!, input: ModifyPostInput!): [String]
    removePost(id: String!): String
  }
  
  type PostResponse {
    id: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
    image: [String]
    createdAt: String!
    updatedAt: String
  }
  
  type CategoryPostResponse {
    label: String!
    items: [Post]
  }
`;
