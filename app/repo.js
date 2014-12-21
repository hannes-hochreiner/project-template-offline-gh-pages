define([
  'q'
], function(Q) {
  return function(utils, pouchdb, pouchdbConfig) {
    var that = this;
    
    that.getAllNotes = function() {
      var def = Q.defer();
      
      pouchdb.allDocs({include_docs: true}).then(function(docs) {
        def.resolve(docs.rows.map(function(entry) {
          return entry.doc;
        }));
      });
      
      return def.promise;
    };
    
    that.addNote = function(note) {
      return pouchdb.post(note).then(function(res) {
        return pouchdb.get(res.id);
      });
    };
    
    that.deleteNote = function(note) {
      return pouchdb.remove(note);
    };
    
    that.getConfig = function(key) {
      var def = Q.defer();
      
      pouchdbConfig.get(key).then(function(doc) {
        def.resolve(doc);
      }).catch(function(err) {
        if (err.message === 'missing') {
          def.resolve({});
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
      var def = Q.defer();
      
      pouchdb.sync(target).on('complete', function(info) {
        def.resolve(info);
      }).on('error', function(error) {
        def.reject(error);
      });
      
      return def.promise;
    };
  };
});
