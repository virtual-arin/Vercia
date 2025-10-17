const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

async function pullRepository() {
  const repoPath = path.resolve(process.cwd(), ".vercia");

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    });
    const data = await s3.send(listCommand);

    if (!data.Contents || data.Contents.length === 0) {
      console.log("No commits to pull from S3.");
      return;
    }

    const objects = data.Contents;

    for (const object of objects) {
      const key = object.Key;

      if (key.endsWith("/")) {
        continue;
      }

      const localFilePath = path.join(repoPath, key);
      const dirName = path.dirname(localFilePath);

      await fs.mkdir(dirName, { recursive: true });

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      };

      const getCommand = new GetObjectCommand(params);
      const response = await s3.send(getCommand);

      // The body of a GetObjectCommand response is a stream
      await fs.writeFile(localFilePath, response.Body);
    }

    console.log("All commits pulled from S3 successfully.");
  } catch (err) {
    console.error("Unable to pull : ", err);
  }
}

module.exports = { pullRepository };
