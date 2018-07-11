const log = require("npmlog");
const { readFile, writeFile, deleteFile, isExists } = require('../lib/fs');
const { options } = require('./definitions');

const INIT_STATUS = 'INIT_STATUS';
const PREPARING_STATUS = 'PREPARING_STATUS';
const PREPARED_STATUS = 'PREPARED_STATUS';
const EXECUTING_STATUS = 'EXECUTING_STATUS';
const ERROR_STATUS = 'ERROR_STATUS';


function getInteractiveStatus() {
  const publishStatus = isExists(options.publishStatusPath) ? readFile(options.publishStatusPath) : null;
  const result = publishStatus || INIT_STATUS;
  log.verbose('getInteractiveStatus', result);
  return result;
}

function resetInteractivePublish() {
  log.verbose('resetInteractivePublish', 'reset publish process');
  if (isExists(options.publishStatusPath)) {
    deleteFile(options.publishStatusPath);
  }
}

function setNewInteractiveStatus(newStatus) {
  if ([PREPARING_STATUS, PREPARED_STATUS, EXECUTING_STATUS, ERROR_STATUS].indexOf(newStatus) === -1) {
    log.error('EINTERACTIVE', `provided status is not supported '${newStatus}'`);
  }
  log.verbose('setNewInteractiveStatus', `from ${getInteractiveStatus()} to ${newStatus}`);
  writeFile(options.publishStatusPath, newStatus);
}

module.exports = {
  INIT_STATUS,
  PREPARING_STATUS,
  PREPARED_STATUS,
  EXECUTING_STATUS,
  ERROR_STATUS,
  getInteractiveStatus,
  resetInteractivePublish,
  setNewInteractiveStatus
};
