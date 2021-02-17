const express = require('express');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const typeDefs = require("../graphql/schemas");
const resolvers = require("../graphql/resolvers");
const context = require("../graphql/context");
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? /loelblog\.com$/
      : true,
  methods: 'OPTIONS,GET,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
}));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: {
    settings: {
      'schema.polling.enable': false,
    },
  },
});

app.use(cookieParser(process.env.COOKIE_SECRET));

apolloServer.applyMiddleware({ app, path: "/" });

const server = createServer(app);

module.exports = server;
