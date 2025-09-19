const express = require("express");
const userRouter = require("./user.router");
const repositoryRouter = require('./repository.router')
const issueRouter = require('./issue.router')

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repositoryRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req, res) => {
  res.send("Welcome!");
});

module.exports = mainRouter;
