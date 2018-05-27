const { execFile, path } = require('child_process');

execFile(path.join('..', 'tools', 'terraform'), process.argv.slice(1), function(err) {
  if (err) {
    console.error(`terraform-exec could not execute 'terraform': ${err}`);
    process.exit(1);
  }
});
