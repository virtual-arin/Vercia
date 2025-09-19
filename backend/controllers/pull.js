const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".vercia");
  const commitPaths = path.join(repoPath, "commits");

  try {
    const listParams = {
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    };
    const data = await s3.send(new ListObjectsV2Command(listParams));

    if (!data.Contents || data.Contents.length === 0) {
      console.log("No commits to pull from S3.");
      return;
    }

    const objects = data.Contents;
    for (const object of objects) {
      const key = object.Key;
      // Skip directories
      if (key.endsWith("/")) continue;

      const commitDir = path.join(
        commitPaths,
        path.dirname(key).split("/").pop()
      );
      await fs.mkdir(commitDir, { recursive: true });

      const getParams = {
        Bucket: S3_BUCKET,
        Key: key,
      };

      const fileContentResponse = await s3.send(
        new GetObjectCommand(getParams)
      );
      const fileContent = await fileContentResponse.Body.transformToByteArray();
      await fs.writeFile(path.join(repoPath, key), fileContent);
    }
    console.log("All commits pulled successfully from S3");
  } catch (error) {
    console.error("An Error occured while pulling files from S3 : ", error);
  }
}

module.exports = { pullRepo };
