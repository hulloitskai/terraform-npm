const { Extract: extract } = require('unzip');
const { createReadStream } = require('fs');

/**
 * Unzips a specified file.
 * @param {string} zipDir The directory of the target zip file.
 * @param {string} destDir The destination directory for the contents of the
 *   zipped file.
 */
async function unzip(zipDir, destDir) {
	return new Promise(resolve => {
		console.log(`Unzipping archive at ${zipDir}...`);
		const zstream = createReadStream(zipDir);

		try {
			const extractor = extract({ path: destDir });
			zstream.pipe(extractor).on('close', function() {
				console.log('Finished unzipping.');
				resolve();
			});
		} catch (err) {
			console.error(`Ran into an error while unzipping: ${err}`);
			// process.exit(40);
		}
		/*
		extractor.on('error', function(err) {
			console.error(`Ran into an error while unzipping: ${err}`);
			process.exit(40);
		});
		*/
	});
}

module.exports = unzip;
