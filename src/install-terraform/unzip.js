const { createWriteStream } = require('fs');
const yauzl = require('yauzl');

/**
 * Unzips a specified file.
 * @param {string} zipDir The directory of the target zip file.
 * @param {string} destDir The destination directory for the unzipped file.
 */
async function unzip(zipDir, destDir) {
  return new Promise(resolve => {
    console.log(`Unzipping archive at ${zipDir}...`);
    const destStream = createWriteStream(destDir);
    yauzl.open(zipDir, callback);

    function callback(err, zip) {
      if (err) {
        console.error(`An error occurred while unzipping: ${err}`);
        process.exit(40);
      }
      zip.on('entry', onEntry);
      // prettier-ignore
      function onEntry(entry) { zip.openReadStream(entry, onStreamOpen); }
      function onStreamOpen(err, stream) {
        if (err) {
          console.error(`Failed to open read stream from zip file: ${err}`);
          process.exit(41);
        }
        stream.pipe(destStream);
      }
      zip.on('end', function() {
        console.log('Finished unzipping.');
        resolve();
      });
    }
  });
}

module.exports = unzip;
