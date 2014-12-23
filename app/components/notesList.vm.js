if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {
  return function(params) {
    var that = this;

    that.ko = params.ko;
    that.repo = params.repo;
    that.pubsub = params.pubsub;

    that.initializing = that.ko.observable(true);
    that.messages = that.ko.observableArray();
    that.notes = that.ko.observableArray();
    
    that.newNoteText = that.ko.observable();
    that.newNoteSave = function() {
      that.repo.addNote({text: that.newNoteText()}).then(function(note) {
        that.newNoteText(null);
      }).fail(function(error) {
        that.messages().push('Error initializing: ' + JSON.stringify(error));
      }).done();
    };
    
    that.noteDelete = function(note) {
      that.repo.deleteNote(note).then(function() {
      }).fail(function(error) {
        that.messages().push('Error initializing: ' + JSON.stringify(error));
      }).done();
    };
    
    function addNote(msg, note) {
      that.notes.splice(0, 0, note);
    }
    
    function deleteNote(msg, note) {
      var idxDel;
      
      that.notes().forEach(function(obj, idx) {
        if (obj._id === note._id) {
          idxDel = idx;
        }
      });
      
      if (typeof idxDel !== 'undefined') {
        that.notes.splice(idxDel, 1);
      }
    }
    
    // Initializing.
    that.repo.getAllNotes().then(function(notes) {
      that.notes(notes);
      that.pubsub.subscribe('noteCreated', addNote);
      that.pubsub.subscribe('noteDeleted', deleteNote);
    }).fail(function(error) {
      that.messages().push('Error initializing: ' + JSON.stringify(error));
    }).fin(function() {
      that.initializing(false);
    }).done();
  };
});
