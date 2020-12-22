const { gql } = require("apollo-server-express");

module.exports = gql`
  type Post {
    id: Int!
    email: String!
    category: String!
    title: String!
    html: String!
    markdown: String!
    image: [String]
    createdAt: String
    updatedAt: String
    user: User!
    comments: [Comment!]
  }
  
  extend type Query {
    getAllPosts: [Post!]
    getPosts: [Post!]
    getSinglePost(postId: Int!): Post
  }
  
  extend type Mutation {
    createPost(title: String!, category: String!, title: String!, html: String!, markdown: String!, image: String!): CreatePostResponse
    modifyPost(id: Int!, title: String!, category: String!, title: String!, html: String!, markdown: String!, image: String!): CreatePostResponse
    deletePost(id: Int!): Int
  }
  
  type CreatePostResponse {
    id: Int!
    category: String!
    title: String!
    html: String!
    markdown: String!
  }
`;
