const { executeCommand } = require('../lib/fs');

async function executeNPMLinkToLibrary(library) {
  await executeCommand('npm', ['link', library]);
}

module.exports = { executeNPMLinkToLibrary };
