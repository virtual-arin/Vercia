const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepository } = require("./controllers/init");
const { addRepository } = require("./controllers/add");
const { commitRepository } = require("./controllers/commit");
const { pushRepository } = require("./controllers/push");
const { pullRepository } = require("./controllers/pull");
const { revertRepository } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("start", "Start a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepository)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepository(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepository(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepository)
  .command("pull", "Pull commits from S3", {}, pullRepository)
  .command(
    "revert <commitId>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Commit Id to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepository(argv.commitId);
    }
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(express.json());

  const mongoURI = process.env.MONGO_DB_URI;
  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on("joinRoom", (userID) => {
      console.log(`Socket ${socket.id} is joining room ${userID}`);
      socket.join(userID);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to database successfully!");

      httpServer.listen(port, () => {
        console.log(`Server is listening to port ${port}`);
      });
    })
    .catch((error) => {
      console.error(
        "Failed to connect to database. Server not started.",
        error
      );
      process.exit(1);
    });
}
