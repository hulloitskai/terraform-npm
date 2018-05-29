const { chmod } = require('fs');

/**
 * Set file permissions for a specified file.
 * @param {string} fileDir The directory of the target file.
 * @param {number} mode An octal number describing the new permissions.
 */
async function setPerms(fileDir, mode) {
  return new Promise(resolve => {
    console.log(`Setting file permissions for ${fileDir}...`);
    chmod(fileDir, mode, callback);

    function callback(err) {
      if (err) {
        console.error(`Could not set file permissions: ${err}`);
        process.exit(50);
      }
      console.log('Done setting file permissions.');
      resolve();
    }
  });
}

module.exports = setPerms;
