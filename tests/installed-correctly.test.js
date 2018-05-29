const { execFile } = require('child_process');

function showError(msg) {
	console.error(`Test 'installed-correctly' failed: ${msg}`);
}

execFile('yarn', ['start', '-v'], function(err, stdout) {
	if (err) {
		showError(err);
		process.exit(1);
	}
	if (stdout.indexOf('Terraform v') === -1) {
		showError(
			`Expected version information from 'terraform -v', instead received: ${stdout}`
		);
		process.exit(2);
	}
});
