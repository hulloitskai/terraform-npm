const { execFile } = require('child_process');

function showError(msg) {
	console.error(`Test 'installed-correctly' failed: ${msg}`);
}

function handleDoubleErrorSource(a, b, code) {
	if (a || b) {
		showError(a || b);
		process.exit(code);
	}
}

execFile('yarn', ['start', '-v'], vCb);
function vCb(err, stdout, stderr) {
	handleDoubleErrorSource(err, stderr, 1);
	const vStr = stdout.substr(stdout.indexOf('\n'));
	if (vStr.indexOf('Terraform v') === -1) {
		showError(
			`Expected version information from 'terraform -v', instead received: ${vStr}`
		);
		process.exit(2);
	}

	execFile('yarn', ['start', 'version'], versionCb);
	function versionCb(err, stodut, stderr) {
		handleDoubleErrorSource(err, stderr, 3);
		const versionStr = stdout.substr(stdout.indexOf('\n'));
		if (versionStr !== vStr) {
			showError(
				"Expected 'terraform -v' and 'terraform version' to have the same output; " +
					`however, 'terraform -v' produces '${vStr}' and 'terraform version' ` +
					`produces '${versionStr}'.`
			);
			process.exit(4);
		}
	}
}
