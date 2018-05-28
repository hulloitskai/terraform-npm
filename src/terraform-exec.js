const { execFile } = require('child_process');
const path = require('path');

const execName = process.platform === 'win32' ? 'terraform.exe' : 'terraform';

execFile(path.join('..', 'tools', execName), process.argv.slice(1), function(err) {
  if (err) {
    console.error(`terraform-exec could not execute 'terraform': ${err}`);
    process.exit(1);
  }
});
