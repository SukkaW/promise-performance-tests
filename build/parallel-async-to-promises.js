function _empty() {}
// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     <https://www.apache.org/licenses/LICENSE-2.0>
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const config = require('../lib/config.js');
function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}
const fakes = require('../lib/fakes-async.js');
function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
module.exports = function parallel(_stream, _idOrPath) {
  try {
    const queries = new Array(config.parallelQueries);
    const tx = fakes.db.begin();
    for (let index = 0; index < queries.length; ++index) {
      queries[index] = fakes.FileVersion.insert({
        index
      }).execWithin(tx);
    }
    return _await(_catch(function () {
      return _await(Promise.all(queries), function () {
        return _awaitIgnored(tx.commit());
      });
    }, function (err) {
      return _await(tx.rollback(), function () {
        throw err;
      });
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
