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

function dummy1() { return Promise.resolve(undefined); }
function dummy2(a) { return Promise.resolve(undefined); }

// a queryish object with all kinds of functions
function Queryish() {}
Queryish.prototype.all = dummy1;
Queryish.prototype.exec = dummy1;
Queryish.prototype.execWithin = dummy2;
Queryish.prototype.get = dummy1;
function queryish() {
  return new Queryish();
}

class Uuid {
  v1() {}
}
const uuid = new Uuid();

const userAccount = { id: 1 };

const account = {};

function Blob() {}
Blob.prototype.put = dummy2;
class BlobManager {
  create() {
    return new Blob();
  }
}
const blobManager = new BlobManager();

const cqQueryish = queryish();

function Self() {}
Self.prototype.byUuidOrPath = queryish;
Self.prototype.createQuery = function createQuery(x, y) {
  return Promise.resolve(cqQueryish);
};
const self = new Self();

function File() {}
File.insert = queryish;
File.whereUpdate = queryish;

function FileVersion() {}
FileVersion.insert = queryish;

function Version() {}
Version.createHash = function createHash(v) {
  return 1;
};
Version.insert = queryish;

function Transaction() {}
Transaction.prototype.commit = dummy1;
Transaction.prototype.rollback = dummy1;

class Db {
  begin() {
    return new Transaction();
  }
}
const db = new Db();

module.exports = {
  uuid,
  userAccount,
  account,
  blobManager,
  self,
  File,
  FileVersion,
  Version,
  db
};
