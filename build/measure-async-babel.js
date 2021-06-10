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
var driver = require('../lib/driver.js');

var config = require('../lib/config.js');

module.exports = /*#__PURE__*/function () {
  var _measure = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fn) {
    var _len,
        args,
        _key,
        times,
        mems,
        k,
        _yield$driver,
        time,
        mem,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            for (_len = _args.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = _args[_key];
            }

            _context.next = 3;
            return driver.apply(void 0, [Math.min(350, config.iterations), fn].concat(args));

          case 3:
            // Perform K runs with N promises.
            times = 0;
            mems = 0;
            k = 0;

          case 6:
            if (!(k < config.runs)) {
              _context.next = 17;
              break;
            }

            _context.next = 9;
            return driver.apply(void 0, [config.iterations, fn].concat(args));

          case 9:
            _yield$driver = _context.sent;
            time = _yield$driver.time;
            mem = _yield$driver.mem;
            times += time;
            mems += mem;

          case 14:
            ++k;
            _context.next = 6;
            break;

          case 17:
            return _context.abrupt("return", {
              time: (times / config.runs).toFixed(3),
              mem: (mems / config.runs / 1024 / 1024).toFixed(3)
            });

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function measure(_x) {
    return _measure.apply(this, arguments);
  }

  return measure;
}();
