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

const driver = require('../lib/driver.js');
const config = require('../lib/config.js');

module.exports = function measure(fn, ...args) {
  // Warm up
  let p = driver(Math.min(350, config.iterations), fn, ...args).then(_ => ({
    ptime: 0,
    pmem: 0
  }));

  for (let k = 0; k < config.runs; ++k) {
    p = p.then(({ ptime, pmem }) => {
      return driver(config.iterations, fn, ...args).then(({ time, mem }) => {
        ptime = ptime + time;
        pmem = pmem + mem;
      }).then(_ => ({ ptime, pmem }));
    });
  }
  return p.then(({ ptime, pmem }) => ({
    time: (ptime / config.runs).toFixed(3),
    mem: (pmem / config.runs / 1024 / 1024).toFixed(3)
  }));
};
