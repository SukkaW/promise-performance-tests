const config = require('../lib/config.js');
const fakes = require('../lib/fakes-callback.js');

module.exports = function parallel(stream, idOrPath, callback) {
  const queries = new Array(config.parallelQueries);
  const tx = fakes.db.begin();

  let current = 0;
  const total = config.parallelQueries;

  for (let index = 0; index < queries.length; ++index) {
    fakes.FileVersion.insert({ index }).execWithin(tx, onComplete);
  }

  function onComplete(err) {
    if (onComplete.called) return;
    onComplete.called = true;
    if (err) {
      tx.rollback();
      callback(err);
    } else {
      current++;
      if (current === total) {
        tx.commit();
        callback();
      }
    }
  }
};
