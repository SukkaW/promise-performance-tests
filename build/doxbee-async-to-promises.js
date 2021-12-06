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
const fakes = require('../lib/fakes-async.js');

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
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

module.exports = function doxbee(stream, idOrPath) {
  try {
    const blob = fakes.blobManager.create(fakes.account);
    const tx = fakes.db.begin();
    const blobPromise = blob.put(stream);
    const filePromise = fakes.self.byUuidOrPath(idOrPath).get();
    return _await(_catch(function () {
      return _await(Promise.all([blobPromise, filePromise]), function ([blobId, file]) {
        const previousId = file ? file.version : null;
        const version = {
          userAccountId: fakes.userAccount.id,
          date: new Date(),
          blobId,
          creatorId: fakes.userAccount.id,
          previousId
        };
        version.id = fakes.Version.createHash(version);
        return _await(fakes.Version.insert(version).execWithin(tx), function () {
          let fileId;
          return _invoke(function () {
            if (!file) {
              const splitPath = idOrPath.split('/');
              const fileName = splitPath[splitPath.length - 1];
              fileId = fakes.uuid.v1();
              return _await(fakes.self.createQuery(idOrPath, {
                id: fileId,
                userAccountId: fakes.userAccount.id,
                name: fileName,
                version: version.id
              }), function (q) {
                return _awaitIgnored(q.execWithin(tx));
              });
            } else {
              fileId = file.id;
            }
          }, function () {
            return _await(fakes.FileVersion.insert({
              fileId,
              versionId: version.id
            }).execWithin(tx), function () {
              return _await(fakes.File.whereUpdate({
                id: fileId
              }, {
                version: version.id
              }).execWithin(tx), function () {
                return _awaitIgnored(tx.commit());
              });
            });
          });
        });
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
