const { gql } = require('apollo-server-express');

module.exports = gql`
  type Comment {
    id: Int!
    name: String!
    password: String!
    contents: String!
    email: User!
    post: Post!
    parent: Int
    class: Int!
    createdAt: Date!
  }
  
  input PostComment {
    name: String!
    password: String!
    parent: Int
    class: Int!
    contents: String!
  }
  
  extend type Query {
    getComments(postId: String!): [CreateCommentResponse]
  }
  
  extend type Mutation {
     createComment(comment: PostComment!, postId: String!, email: String): CreateCommentResponse
  }
  
  type CreateCommentResponse {
    id: Int!
    name: String!
    contents: String!
    email: String
    parent: Int
    class: Int!
    createdAt: Date!
  }
`;
