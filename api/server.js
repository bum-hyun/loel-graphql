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
const uploadRouter = require("../routes/upload");
const postRouter = require("../routes/post");
const sitemapRouter = require("../routes/sitemap");
const dartRouter = require("../routes/dart");
dotenv.config();

const allowlist = ['http://localhost:3000', 'https://loelblog.com', 'https://www.loelblog.com']
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  corsOptions = { 
    ...corsOptions,   
    methods: 'OPTIONS,GET,PUT,PATCH,POST,DELETE,HEAD',
    credentials: true,
    preflightContinue: false
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

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
app.use('/upload', uploadRouter);
app.use('/resize', uploadRouter);
app.use('/post', postRouter);
app.use('/sitemap', sitemapRouter);
app.use('/dart', dartRouter);

apolloServer.applyMiddleware({ app, path: "/graphql" });

const server = createServer(app);

module.exports = server;
