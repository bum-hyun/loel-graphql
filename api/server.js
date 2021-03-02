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
dotenv.config();

const allowlist = ['https://loelblog.com', 'https://www.loelblog.com']
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

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
apolloServer.applyMiddleware({ app, path: "/graphql" });

const server = createServer(app);

module.exports = server;
