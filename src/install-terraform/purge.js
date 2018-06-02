const { unlink } = require('fs');

/**
 * Deletes the specified file.
 * @param {string} fileDir
 */
async function purge(fileDir) {
  return new Promise(function(resolve) {
    unlink(fileDir, callback);

    function callback(err) {
      if (err) {
        console.error(`An error occurred while deleting the Terraform zip: ${err}`);
        process.exit(8);
      }
      resolve();
    }
  });
}

module.exports = purge;
