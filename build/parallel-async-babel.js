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
var config = require('../lib/config.js');

var fakes = require('../lib/fakes-async.js');

module.exports = /*#__PURE__*/function () {
  var _parallel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stream, idOrPath) {
    var queries, tx, index;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            queries = new Array(config.parallelQueries);
            tx = fakes.db.begin();

            for (index = 0; index < queries.length; ++index) {
              queries[index] = fakes.FileVersion.insert({
                index: index
              }).execWithin(tx);
            }

            _context.prev = 3;
            _context.next = 6;
            return Promise.all(queries);

          case 6:
            _context.next = 8;
            return tx.commit();

          case 8:
            _context.next = 15;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            _context.next = 14;
            return tx.rollback();

          case 14:
            throw _context.t0;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 10]]);
  }));

  function parallel(_x, _x2) {
    return _parallel.apply(this, arguments);
  }

  return parallel;
}();
