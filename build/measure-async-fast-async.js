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

const {
  driver
} = require('../lib/driver.js');
const config = require('../lib/config.js');
module.exports = function measure(fn, ...args) {
  return new Promise(function ($return, $error) {
    let times, mems;
    return Promise.resolve(driver(Math.min(350, config.iterations), fn, ...args)).then(function ($await_3) {
      try {
        {
          times = 0;
          mems = 0;
          var $Loop_1_trampoline, $Loop_1_local;
          function $Loop_1_step() {
            var [k] = $Loop_1_local();
            ++k;
            return $Loop_1.bind(this, k);
          }
          function $Loop_1(k) {
            $Loop_1_local = function () {
              return [k];
            };
            if (k < config.runs) {
              let time, mem;
              return Promise.resolve(driver(config.iterations, fn, ...args)).then(function ($await_4) {
                try {
                  ({
                    time,
                    mem
                  } = $await_4);
                  times += time;
                  mems += mem;
                  return $Loop_1_step;
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }, $error);
            } else return [1];
          }
          return ($Loop_1_trampoline = function (q) {
            while (q) {
              if (q.then) return void q.then($Loop_1_trampoline, $error);
              try {
                if (q.pop) {
                  if (q.length) return q.pop() ? $Loop_1_exit.call(this) : q;else q = $Loop_1_step;
                } else q = q.call(this);
              } catch (_exception) {
                return $error(_exception);
              }
            }
          }.bind(this))($Loop_1.bind(this, 0));
          function $Loop_1_exit() {
            return $return({
              time: (times / config.runs).toFixed(3),
              mem: (mems / config.runs / 1024 / 1024).toFixed(3)
            });
          }
        }
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  });
};
