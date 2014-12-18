define([
  'q'
], function(Q) {
  return function(utils, pouchdb) {
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
  };
});
