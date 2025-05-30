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

async function dummy1() {
  // noop
}
async function dummy2(_a) {
  // noop
}

// a queryish object with all kinds of functions
function Queryish() {
  // noop
}
Queryish.prototype.all = dummy1;
Queryish.prototype.exec = dummy1;
Queryish.prototype.execWithin = dummy2;
Queryish.prototype.get = dummy1;
function queryish() {
  return new Queryish();
}

class Uuid {
  v1() {
    return '';
  }
}

const uuid = new Uuid();

const userAccount = { id: 1 };

const account = {};

function Blob() {
  // fake class
}
Blob.prototype.put = dummy2;

class BlobManager {
  create() {
    return new Blob();
  }
}

const blobManager = new BlobManager();

const cqQueryish = queryish();

function Self() {
  // fake class
}
Self.prototype.byUuidOrPath = queryish;
// eslint-disable-next-line require-await -- benchmark
Self.prototype.createQuery = async function createQuery(_x, _y) { return cqQueryish; };
const self = new Self();

function File() {
  // fake class
}
File.insert = queryish;
File.whereUpdate = queryish;

function FileVersion() {
  // fake class
}
FileVersion.insert = queryish;

function Version() {
  // fake class
}
Version.createHash = function createHash(_v) {
  return 1;
};
Version.insert = queryish;

function Transaction() {
  // fake class
}
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
