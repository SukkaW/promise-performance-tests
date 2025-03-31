const fakes = require('../lib/fakes-callback.js');

module.exports = function doxbee(stream, idOrPath, callback) {
  const blob = fakes.blobManager.create(fakes.account);
  const tx = fakes.db.begin();
  let version, blobId;

  blob.put(stream, (err, blobIdV) => {
    if (err) return callback(err);

    blobId = blobIdV;
    fakes.self.byUuidOrPath(idOrPath).get((err, file) => {
      if (err) return callback(err);

      const previousId = file ? file.version : null;
      version = {
        userAccountId: fakes.userAccount.id,
        date: new Date(),
        blobId,
        creatorId: fakes.userAccount.id,
        previousId
      };

      version.id = fakes.Version.createHash(version);
      fakes.Version.insert(version).execWithin(tx, (err, file) => {
        if (err) return backoff(err);
        if (file) {
          return afterFileExists(null, file.id);
        }
        const splitPath = idOrPath.split('/');
        const fileName = splitPath[splitPath.length - 1];
        const newId = fakes.uuid.v1();

        fakes.self.createQuery(idOrPath, {
          id: newId,
          userAccountId: fakes.userAccount.id,
          name: fileName,
          version: version.id
        }, (err, query) => {
          if (err) return backoff(err);
          query.execWithin(tx, (err) => {
            if (err) {
              return afterFileExists(err, newId);
            }
          });
        });
      });
    });
  });

  function backoff(err) {
    tx.rollback();
    return callback(err);
  }

  function afterFileExists(err, fileId) {
    if (err) return backoff(err);
    fakes.FileVersion
      .insert({ fileId, versionId: version.id })
      .execWithin(tx, (err) => {
        if (err) return backoff(err);
        fakes.File.whereUpdate({ id: fileId }, {
          version: version.id
        }).execWithin(tx, (err) => {
          if (err) return backoff(err);
          tx.commit(callback);
        });
      });

    return fileId;
  }
};
