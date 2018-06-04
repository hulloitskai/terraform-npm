const { execFile } = require('child_process');
const {
  showNotFoundError,
  showError: _showError
} = require('./installed-correctly-common');

const showError = msg => _showError('installed-correctly', msg);

execFile('yarn', ['start', '-v'], function(err, stdout) {
  if (err) {
    showError(err);
    process.exit(1);
  }
  if (stdout.indexOf('Terraform v') === -1) showNotFoundError(showError);
  console.log("Passed test: 'installed-correctly'");
});
