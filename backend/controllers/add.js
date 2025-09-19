const fs = require("fs").promises;
const path = require("path");

async function addRepository(filePath) {
  const repositoryPath = path.resolve(process.cwd(), ".vercia");
  const stagingPath = path.join(repositoryPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added to the staging area!`);
  } catch (error) {
    console.error("An Error occured while adding file : ", error);
  }
}

module.exports = { addRepository };
