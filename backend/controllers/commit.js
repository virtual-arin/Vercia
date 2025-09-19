const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepository(message) {
  const repositoryPath = path.resolve(process.cwd(), ".vercia");
  const stagedPath = path.join(repositoryPath, "staging");
  const commitPath = path.join(repositoryPath, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });
    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file)
      );
    }
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );
    console.log(`Commit ${commitId} created with message : ${message}`);
  } catch (error) {
    console.error("An Error occured while committing files : ", error);
  }
}

module.exports = { commitRepository };
