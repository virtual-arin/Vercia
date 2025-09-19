const express = require("express");
const repositoryController = require("../controllers/repositoryController");

const repositoryRouter = express.Router();

repositoryRouter.post(
  "/repository/create",
  repositoryController.createRepository
);
repositoryRouter.get("/repository/all", repositoryController.getAllRepository);
repositoryRouter.get(
  "/repository/:id",
  repositoryController.fetchRepositoryById
);
repositoryRouter.get(
  "/repository/name/:name",
  repositoryController.fetchRepositoryByName
);
repositoryRouter.get(
  "/repository/user/:id",
  repositoryController.fetchRepositoriesByUserId
);

repositoryRouter.put(
  "/repository/update/:id",
  repositoryController.updateRepositoryById
);
repositoryRouter.patch(
  "/repository/toggle/:id",
  repositoryController.toggleVisibilityById
);
repositoryRouter.delete(
  "/repository/delete/:id",
  repositoryController.deleteRepositoryById
);

module.exports = repositoryRouter;
