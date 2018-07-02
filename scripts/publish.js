
const { executeCommand } = require('./lib/utils');
const { getCurrentBranch } = require('./lib/git');

async function main() {
  console.log(`execute publish command`);

  const currentBranch = getCurrentBranch();
}

(async function() {
  await main();
}());


