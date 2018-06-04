function showNotFoundError(showError) {
  showError(
    `Expected version information from 'terraform -v', instead received: ${stdout}`
  );
  process.exit(2);
}

function showError(testName, msg) {
  console.error(`Test '${testName}' failed: ${msg}`);
}

module.exports = { showNotFoundError, showError };
