require("dotenv").config();

const server = require("./api/server");

const port = process.env.PORT;

process.on("uncaughtException", () => {
  console.error(`${(new Date()).toUTCString()} uncaughtException`, err);
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error(`${(new Date()).toUTCString()} unhandledRejection:`, err);
});


server.listen({ port }, () => console.log(
  `🚀 Server ready at http://localhost:${port}/api`,
));
