const mongoose = require("mongoose");
const Repository = require("../models/repositoryModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

//Create Repository
async function createRepository(req, res) {
  const { name, description, content, visibility, owner, issues } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const newRepository = new Repository({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created successfully!",
      repositoryID: result._id,
    });
  } catch (error) {
    console.error(
      "An Error occurred while creating repository : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Get all Repositories
async function getAllRepository(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (error) {
    console.error(
      "An Error occurred while getting all repositories : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Get a Repository by id
async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Repository ID" });
  }
  try {
    const repository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repository);
  } catch (error) {
    console.error(
      "An Error occurred while getting repository by id : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Get a Repository by name
async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.findOne({ name: name })
      .populate("owner")
      .populate("issues");
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json(repository);
  } catch (error) {
    console.error(
      "An Error occurred while getting repository by name : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Get a Repository for current user
async function fetchRepositoriesByUserId(req, res) {
  const { id: userID } = req.params;
  try {
    const repositories = await Repository.find({ owner: userID }).populate(
      "owner"
    );

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ message: "User Repositories not found" });
    }

    res.json({ message: "Repositories found!", repositories });
  } catch (error) {
    console.error(
      "An Error occurred while getting repository for current user : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Update a Repository
async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();
    res.json({
      message: "Repository updated successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error(
      "An Error occurred while updating repository : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Toggle a Repository
async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error(
      "An Error occurred while toggling repository : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Delete a repository
async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json({
      message: "Repository deleted successfully",
    });
  } catch (error) {
    console.error(
      "An Error occurred while deleting repository : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  createRepository,
  getAllRepository,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesByUserId,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
