const { execFile } = require('child_process');
const path = require('path');

function showError(msg) {
  console.error(`Test 'installed-correctly' failed: ${msg}`);
}

const execName = process.platform === 'win32' ? 'terraform.exe' : 'terraform';

execFile(path.join('..', 'tools', execName), ['-v'], function(err, stdout, stderr) {
  if (err || stderr) {
    showError(err || stderr);
    process.exit(1);
  }
  if (stdout.indexOf('Terraform') === -1) {
    showError(
      `Expected version information from 'terraform -v', instead received: ${stdout}`
    );
    process.exit(2);
  }
});
