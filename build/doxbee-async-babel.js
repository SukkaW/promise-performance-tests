"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
var fakes = require('../lib/fakes-async.js');

module.exports = /*#__PURE__*/function () {
  var _doxbee = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stream, idOrPath) {
    var blob, tx, blobId, file, previousId, version, fileId, splitPath, fileName, q;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            blob = fakes.blobManager.create(fakes.account);
            tx = fakes.db.begin();
            _context.prev = 2;
            _context.next = 5;
            return blob.put(stream);

          case 5:
            blobId = _context.sent;
            _context.next = 8;
            return fakes.self.byUuidOrPath(idOrPath).get();

          case 8:
            file = _context.sent;
            previousId = file ? file.version : null;
            version = {
              userAccountId: fakes.userAccount.id,
              date: new Date(),
              blobId: blobId,
              creatorId: fakes.userAccount.id,
              previousId: previousId
            };
            version.id = fakes.Version.createHash(version);
            _context.next = 14;
            return fakes.Version.insert(version).execWithin(tx);

          case 14:
            if (file) {
              _context.next = 25;
              break;
            }

            splitPath = idOrPath.split('/');
            fileName = splitPath[splitPath.length - 1];
            fileId = fakes.uuid.v1();
            _context.next = 20;
            return fakes.self.createQuery(idOrPath, {
              id: fileId,
              userAccountId: fakes.userAccount.id,
              name: fileName,
              version: version.id
            });

          case 20:
            q = _context.sent;
            _context.next = 23;
            return q.execWithin(tx);

          case 23:
            _context.next = 26;
            break;

          case 25:
            fileId = file.id;

          case 26:
            _context.next = 28;
            return fakes.FileVersion.insert({
              fileId: fileId,
              versionId: version.id
            }).execWithin(tx);

          case 28:
            _context.next = 30;
            return fakes.File.whereUpdate({
              id: fileId
            }, {
              version: version.id
            }).execWithin(tx);

          case 30:
            _context.next = 32;
            return tx.commit();

          case 32:
            _context.next = 39;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](2);
            _context.next = 38;
            return tx.rollback();

          case 38:
            throw _context.t0;

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 34]]);
  }));

  function doxbee(_x, _x2) {
    return _doxbee.apply(this, arguments);
  }

  return doxbee;
}();
