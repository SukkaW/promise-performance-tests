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
module.exports = function doxbee(stream, idOrPath) {
  return new Promise(function ($return, $error) {
    let blob, tx, blobPromise, filePromise;
    blob = fakes.blobManager.create(fakes.account);
    tx = fakes.db.begin();
    blobPromise = blob.put(stream);
    filePromise = fakes.self.byUuidOrPath(idOrPath).get();
    var $Try_1_Post = function () {
      try {
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    };
    var $Try_1_Catch = function (err) {
      try {
        return Promise.resolve(tx.rollback()).then(function ($await_3) {
          try {
            throw err;
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    };
    try {
      let blobId, file, previousId, version, fileId;
      return Promise.resolve(Promise.all([blobPromise, filePromise])).then(function ($await_4) {
        try {
          [blobId, file] = $await_4;
          previousId = file ? file.version : null;
          version = {
            userAccountId: fakes.userAccount.id,
            date: new Date(),
            blobId,
            creatorId: fakes.userAccount.id,
            previousId
          };
          version.id = fakes.Version.createHash(version);
          return Promise.resolve(fakes.Version.insert(version).execWithin(tx)).then(function ($await_5) {
            try {
              if (!file) {
                let splitPath, fileName, q;
                splitPath = idOrPath.split('/');
                fileName = splitPath[splitPath.length - 1];
                fileId = fakes.uuid.v1();
                return Promise.resolve(fakes.self.createQuery(idOrPath, {
                  id: fileId,
                  userAccountId: fakes.userAccount.id,
                  name: fileName,
                  version: version.id
                })).then(function ($await_6) {
                  try {
                    q = $await_6;
                    return Promise.resolve(q.execWithin(tx)).then(function ($await_7) {
                      try {
                        return $If_2.call(this);
                      } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                      }
                    }.bind(this), $Try_1_Catch);
                  } catch ($boundEx) {
                    return $Try_1_Catch($boundEx);
                  }
                }.bind(this), $Try_1_Catch);
              } else {
                fileId = file.id;
                return $If_2.call(this);
              }
              function $If_2() {
                return Promise.resolve(fakes.FileVersion.insert({
                  fileId,
                  versionId: version.id
                }).execWithin(tx)).then(function ($await_8) {
                  try {
                    return Promise.resolve(fakes.File.whereUpdate({
                      id: fileId
                    }, {
                      version: version.id
                    }).execWithin(tx)).then(function ($await_9) {
                      try {
                        return Promise.resolve(tx.commit()).then(function ($await_10) {
                          try {
                            return $Try_1_Post();
                          } catch ($boundEx) {
                            return $Try_1_Catch($boundEx);
                          }
                        }, $Try_1_Catch);
                      } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                      }
                    }, $Try_1_Catch);
                  } catch ($boundEx) {
                    return $Try_1_Catch($boundEx);
                  }
                }, $Try_1_Catch);
              }
            } catch ($boundEx) {
              return $Try_1_Catch($boundEx);
            }
          }.bind(this), $Try_1_Catch);
        } catch ($boundEx) {
          return $Try_1_Catch($boundEx);
        }
      }.bind(this), $Try_1_Catch);
    } catch (err) {
      $Try_1_Catch(err)
    }
  });
};
