const { parse: parseUrl } = require('url');
const { createWriteStream } = require('fs');
const Progress = require('progress');
const { get } = require('https');

/**
 * Download a file at a URL, while displaying a progress bar.
 * @param {string} url The source URL to download from.
 * @param {string} destDir The destination directory.
 */
async function download(url, destDir) {
  // Get requisites...
  const fstream = createWriteStream(destDir).on('error', function(err) {
    console.error(`Could not open write stream for download: ${err}`);
  });

  // Initiate download...
  console.log(`Downloading zipped Terraform executable from ${url}...`);
  return new Promise(resolve => {
    get(parseUrl(url), function(res) {
      const totalChunks = parseInt(res.headers['content-length'], 10);
      const prgbar = new Progress('[:bar] :percent ', { total: totalChunks });
      res
        .on('data', function(chunk) {
          fstream.write(chunk);
          prgbar.tick(chunk.length);
        })
        .on('end', function() {
          fstream.end();
          console.log('Download finished.');
          fstream.close(resolve);
        })
        .on('error', function(err) {
          console.error(`Failed to download zipped Terraform executable: ${err}`);
          process.exit(30);
        });
    }).on('error', function(err) {
      console.error(`Failed to download zipped Terraform executable: ${err}`);
      process.exit(31);
    });
  });
}

module.exports = download;
