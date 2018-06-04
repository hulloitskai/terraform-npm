const { exec } = require('child_process');
const {
  showNotFoundError,
  showError: _showError
} = require('./installed-correctly-common');

const showError = msg => _showError('installed-correctly-global', msg);

exec('terraform -v', function(err, stdout, stderr) {
  if (err || stderr) {
    showError(err || stderr);
    process.exit(1);
  }
  if (stdout.indexOf('Terraform v') === -1) showNotFoundError(showError);
  console.log("Passed test: 'installed-correctly-global'");
});
