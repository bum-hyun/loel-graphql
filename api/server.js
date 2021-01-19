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
const redis = require("redis");
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const hpp = require('hpp');
dotenv.config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

app.use(cors());

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
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({ client: redisClient }),
};

apolloServer.applyMiddleware({ app, path: "/api" });

const server = createServer(app);

module.exports = server;
