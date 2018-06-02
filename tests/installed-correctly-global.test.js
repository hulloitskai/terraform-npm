const { exec } = require('child_process');

function showError(msg) {
  console.error(`Test 'installed-correctly-global' failed: ${msg}`);
}

exec('terraform -v', function(err, stdout, stderr) {
  if (err || stderr) {
    showError(err || stderr);
    process.exit(1);
  }
  if (stdout.indexOf('Terraform v') === -1) {
    showError(
      `Expected version information from 'terraform -v', instead received: ${stdout}`
    );
    process.exit(2);
  }
  console.log("Passed test: 'installed-correctly-global'");
});
