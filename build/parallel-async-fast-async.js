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
const fakes = require('../lib/fakes-async.js');
module.exports = function parallel(stream, idOrPath) {
  return new Promise(function ($return, $error) {
    let queries, tx;
    queries = new Array(config.parallelQueries);
    tx = fakes.db.begin();
    for (let index = 0; index < queries.length; ++index) {
      queries[index] = fakes.FileVersion.insert({
        index
      }).execWithin(tx);
    }
    var $Try_1_Post = function () {
      try {
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    };
    var $Try_1_Catch = function (err) {
      try {
        return Promise.resolve(tx.rollback()).then(function ($await_2) {
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
      return Promise.resolve(Promise.all(queries)).then(function ($await_3) {
        try {
          return Promise.resolve(tx.commit()).then(function ($await_4) {
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
    } catch (err) {
      $Try_1_Catch(err)
    }
  });
};
