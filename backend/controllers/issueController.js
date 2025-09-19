const mongoose = require("mongoose");
const Repository = require("../models/repositoryModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

//Create Issue
async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    console.error("An Error occurred while creating issue : ", error.message);
    res.status(500).send("Internal server error");
  }
}

//Get a Issue by Id
async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    console.error("An Error occurred while getting issue : ", error.message);
    res.status(500).send("Internal server error");
  }
}

//Get All Issues
async function getAllIssues(req, res) {
  const { id } = req.params;
  try {
    const issues = Issue.find({ repository: id });

    if (!issues) {
      return res.status(400).json({ error: "Issue not found" });
    }

    res.status(200).json(issues);
  } catch (error) {
    console.error(
      "An Error occurred while getting all issues : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Update a issue
async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(400).json({ error: "Issue not found" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();
    res.json(issue, { message: "Issue updated successfully" });
  } catch (error) {
    console.error("An Error occurred while updating issue : ", error.message);
    res.status(500).send("Internal server error");
  }
}

//Delete Issue
async function deleteIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(400).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("An Error occurred while deleting issue : ", error.message);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  createIssue,
  getIssueById,
  getAllIssues,
  updateIssueById,
  deleteIssueById,
};
