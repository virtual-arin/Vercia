const fs = require("fs").promises;
const path = require("path");

async function initRepository() {
  const repositoryPath = path.resolve(process.cwd(), ".vercia");
  const commitsPath = path.join(repositoryPath, "commits");
  try {
    await fs.mkdir(repositoryPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      path.join(repositoryPath, "config.json"),
      JSON.stringify({ bucket: process.env.S3_BUCKET })
    );
    console.log("Initialized a Git repository");
  } catch (error) {
    console.error("An Error occured while initialising repository", error);
  }
}

module.exports = { initRepository };
