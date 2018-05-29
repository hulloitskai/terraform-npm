#!/usr/bin/env node
'use strict';

const { spawn } = require('child_process');
const { resolve } = require('path');

const command = process.platform === 'win32' ? 'terraform.exe' : './terraform';
const terraform = spawn(command, process.argv.slice(2), {
	cwd: resolve(__dirname, '..', 'tools')
});

terraform.stdout.pipe(process.stdout);
terraform.stderr.pipe(process.stderr);
terraform.on('error', function(err) {
	console.error(`Received an error while executing the Terraform binary: ${err}`);
});
