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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fakes = require('../lib/fakes-async.js');
module.exports = function doxbee(stream, idOrPath) {
    return __awaiter(this, void 0, void 0, function () {
        var blob, tx, blobPromise, filePromise, _a, blobId, file, previousId, version, fileId, splitPath, fileName, q, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    blob = fakes.blobManager.create(fakes.account);
                    tx = fakes.db.begin();
                    blobPromise = blob.put(stream);
                    filePromise = fakes.self.byUuidOrPath(idOrPath).get();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 13]);
                    return [4 /*yield*/, Promise.all([blobPromise, filePromise])];
                case 2:
                    _a = _b.sent(), blobId = _a[0], file = _a[1];
                    previousId = file ? file.version : null;
                    version = {
                        userAccountId: fakes.userAccount.id,
                        date: new Date(),
                        blobId: blobId,
                        creatorId: fakes.userAccount.id,
                        previousId: previousId
                    };
                    version.id = fakes.Version.createHash(version);
                    return [4 /*yield*/, fakes.Version.insert(version).execWithin(tx)];
                case 3:
                    _b.sent();
                    fileId = void 0;
                    if (!!file) return [3 /*break*/, 6];
                    splitPath = idOrPath.split('/');
                    fileName = splitPath[splitPath.length - 1];
                    fileId = fakes.uuid.v1();
                    return [4 /*yield*/, fakes.self.createQuery(idOrPath, {
                            id: fileId,
                            userAccountId: fakes.userAccount.id,
                            name: fileName,
                            version: version.id
                        })];
                case 4:
                    q = _b.sent();
                    return [4 /*yield*/, q.execWithin(tx)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    fileId = file.id;
                    _b.label = 7;
                case 7: return [4 /*yield*/, fakes.FileVersion.insert({
                        fileId: fileId,
                        versionId: version.id
                    }).execWithin(tx)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, fakes.File.whereUpdate({ id: fileId }, { version: version.id }).execWithin(tx)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, tx.commit()];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 11:
                    err_1 = _b.sent();
                    return [4 /*yield*/, tx.rollback()];
                case 12:
                    _b.sent();
                    throw err_1;
                case 13: return [2 /*return*/];
            }
        });
    });
};
