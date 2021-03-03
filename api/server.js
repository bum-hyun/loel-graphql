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
const anyRouter = require("../routes/any");
dotenv.config();

const allowlist = ['https://loelblog.com', 'https://www.loelblog.com']
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  corsOptions = { 
    ...corsOptions,   
    methods: 'OPTIONS,GET,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      "Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Origin,Cache-Control,Content-Type,X-Token,X-Refresh-Token",   credentials: true,   preflightContinue: false,
    optionsSuccessStatus: 204,
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
app.use('/any', anyRouter);
apolloServer.applyMiddleware({ app, path: "/graphql" });

const server = createServer(app);

module.exports = server;
