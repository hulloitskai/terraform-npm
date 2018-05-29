const { exec } = require('child_process');

function showError(msg) {
	console.error(`Test 'global' failed: ${msg}`);
}

function handleDoubleErrorSource(a, b, code) {
	if (a || b) {
		showError(a || b);
		process.exit(code);
	}
}

exec('terraform -v', vCb);
function vCb(err, vOut, stderr) {
	handleDoubleErrorSource(err, stderr, 1);
	if (vOut.indexOf('Terraform v') === -1) {
		showError(
			`Expected version information from 'terraform -v', instead received: ${vOut}`
		);
		process.exit(2);
	}

	exec('terraform version', versionCb);
	function versionCb(err, versionOut, stderr) {
		handleDoubleErrorSource(err, stderr, 3);
		if (versionOut !== vOut) {
			showError(
				"Expected 'terraform -v' and 'terraform version' to have the same output; " +
					`however, 'terraform -v' produces '${vOut}' and 'terraform version' ` +
					`produces '${versionOut}'.`
			);
			process.exit(4);
		}
	}
}
