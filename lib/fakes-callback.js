const dummy1 = (cb) => cb();
const dummy2 = (_, cb) => cb();

// a queryish object with all kinds of functions
function Queryish() {
  // fake class
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
Self.prototype.createQuery = function createQuery(_x, _y) {
  return Promise.resolve(cqQueryish);
};
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
