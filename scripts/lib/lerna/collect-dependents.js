"use strict";
const log = require("npmlog");

module.exports = collectDependents;

function collectDependents(libraries) {
  const collected = new Set();


  libraries.forEach(currentLibrary => {
    if (currentLibrary.dependents.length === 0) {
      // no point diving into a non-existent tree

      return;
    }

    // depth-first search
    const seen = new Set();
    const visit = (dependentLibrary) => {
      if (seen.has(dependentLibrary)) {
        return;
      }

      seen.add(dependentLibrary);

      if (dependentLibrary === currentLibrary) {
        // a direct or transitive cycle, skip it
        return;
      }

      collected.add(dependentLibrary);

      dependentLibrary.dependents.forEach(visit);
    };


    currentLibrary.dependents.forEach(visit);
  });

  return collected;
}
