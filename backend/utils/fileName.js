const crypto = require('crypto');

function generateFileName(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
  generateFileName
};
