"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
    var blob, tx, blobPromise, filePromise, _yield$Promise$all, _yield$Promise$all2, blobId, file, previousId, version, fileId, splitPath, fileName, q;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            blob = fakes.blobManager.create(fakes.account);
            tx = fakes.db.begin();
            blobPromise = blob.put(stream);
            filePromise = fakes.self.byUuidOrPath(idOrPath).get();
            _context.prev = 4;
            _context.next = 7;
            return Promise.all([blobPromise, filePromise]);

          case 7:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            blobId = _yield$Promise$all2[0];
            file = _yield$Promise$all2[1];
            previousId = file ? file.version : null;
            version = {
              userAccountId: fakes.userAccount.id,
              date: new Date(),
              blobId: blobId,
              creatorId: fakes.userAccount.id,
              previousId: previousId
            };
            version.id = fakes.Version.createHash(version);
            _context.next = 16;
            return fakes.Version.insert(version).execWithin(tx);

          case 16:
            if (file) {
              _context.next = 27;
              break;
            }

            splitPath = idOrPath.split('/');
            fileName = splitPath[splitPath.length - 1];
            fileId = fakes.uuid.v1();
            _context.next = 22;
            return fakes.self.createQuery(idOrPath, {
              id: fileId,
              userAccountId: fakes.userAccount.id,
              name: fileName,
              version: version.id
            });

          case 22:
            q = _context.sent;
            _context.next = 25;
            return q.execWithin(tx);

          case 25:
            _context.next = 28;
            break;

          case 27:
            fileId = file.id;

          case 28:
            _context.next = 30;
            return fakes.FileVersion.insert({
              fileId: fileId,
              versionId: version.id
            }).execWithin(tx);

          case 30:
            _context.next = 32;
            return fakes.File.whereUpdate({
              id: fileId
            }, {
              version: version.id
            }).execWithin(tx);

          case 32:
            _context.next = 34;
            return tx.commit();

          case 34:
            _context.next = 41;
            break;

          case 36:
            _context.prev = 36;
            _context.t0 = _context["catch"](4);
            _context.next = 40;
            return tx.rollback();

          case 40:
            throw _context.t0;

          case 41:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 36]]);
  }));

  function doxbee(_x, _x2) {
    return _doxbee.apply(this, arguments);
  }

  return doxbee;
}();
