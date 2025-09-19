const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

async function pushRepository() {
  const repositoryPath = path.resolve(process.cwd(), ".vercia");
  const commitPaths = path.join(repositoryPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitPaths);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitPaths, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };
        await s3.send(new PutObjectCommand(params));
      }
    }
    console.log("All commits pushed successfully to S3");
  } catch (error) {
    console.error("An Error occured while pushing files to S3 : ", error);
  }
}

module.exports = { pushRepository };
