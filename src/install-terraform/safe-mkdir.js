const { access, mkdir: _mkdir, constants } = require('fs');

/**
 * Make the desired directory if it does not already exist
 * @param {string} dir
 */
async function safeMkdir(dir) {
	return new Promise(resolve => {
		access(dir, constants.F_OK, callback);

		// If the tools directory does not exist, create it; else continue with
		// program flow.
		function callback(err) {
			if (err) {
				console.log("'tools/' directory does not exist, creating...");
				mkdir();
			} else resolve();
		}

		// Make the desired directory.
		function mkdir() {
			_mkdir(dir, onError);
			function onError(err) {
				if (err) {
					console.error(`Could not create the directory '${dir}': ${err}`);
					process.exit(20);
				}
				resolve();
			}
		}
	});
}

module.exports = safeMkdir;
