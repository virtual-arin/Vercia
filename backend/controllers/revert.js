const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepository(commitId) {
  const repositoryPath = path.resolve(process.cwd(), ".vercia");
  const commitPaths = path.join(repositoryPath, "commits");

  try {
    const commitDir = path.join(commitPaths, commitId);
    const files = await readdir(commitDir);
    const parentDir = path.resolve(repositoryPath, "..");

    for (const file of files) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }
    console.log(`Commit ${commitId} reverted successfully!`);
  } catch (error) {
    console.error("An Error occured while reverting files : ", error);
  }
}

module.exports = { revertRepository };
