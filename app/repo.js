define([
  'q'
], function(Q) {
  return function(utils, pouchdb, pouchdbConfig, pubsub) {
    var that = this;
    
    pouchdb.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('create', function(change) {
      pubsub.publish('noteCreated', change.doc);
    }).on('update', function(change) {
      pubsub.publish('noteUpdated', change.doc);
    }).on('delete', function(change) {
      pubsub.publish('noteDeleted', change.doc);
    });
    
    that.getAllNotes = function() {
      var def = Q.defer();
      
      pouchdb.allDocs({include_docs: true}).then(function(docs) {
        def.resolve(docs.rows.map(function(entry) {
          return entry.doc;
        }));
      }).catch(function(error) {
        def.reject(error);
      });
      
      return def.promise;
    };
    
    that.addNote = function(note) {
      var def = Q.defer();
      
      pouchdb.post(note).then(function(res) {
        def.resolve(res);
      }).catch(function(error) {
        def.reject(error);
      });
      
      return def.promise;
    };
    
    that.deleteNote = function(note) {
      var def = Q.defer();
      
      pouchdb.remove(note).then(function(res) {
        def.resolve(res);
      }).catch(function(error) {
        def.reject(error);
      });
      
      return def.promise;
    };
    
    that.getConfig = function(key) {
      var def = Q.defer();
      
      pouchdbConfig.get(key).then(function(doc) {
        def.resolve(doc);
      }).catch(function(err) {
        if (err.message === 'missing') {
          def.resolve();
        } else {
          def.reject(err);
        }
      });
      
      return def.promise;
    };
    
    that.setConfig = function(key, value) {
      var def = Q.defer();
      
      pouchdbConfig.put(value, key).then(function(res) {
        return pouchdbConfig.get(res.id);
      }).then(function(doc) {
        def.resolve(doc);
      }).catch(function(err) {
        def.reject(err);
      });
      
      return def.promise;
    };
    
    that.sync = function(target) {
      return pouchdb.sync(target, { live: true }).on('complete', function(info) {
        pubsub.publish('syncDone', info);
      }).on('error', function(error) {
        pubsub.publish('syncError', error);
      }).on('change', function(info) {
        pubsub.publish('syncDone', info);
      }).on('uptodate', function(info) {
        pubsub.publish('syncDone', info);
      });
    };
  };
});
