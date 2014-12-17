if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {
  return function(params) {
    var that = this;

    that.ko = params.ko;
    that.repo = params.repo;

    that.initializing = that.ko.observable(true);
    that.messages = that.ko.observableArray();
    that.notes = that.ko.observableArray();
    
    that.newNoteText = that.ko.observable();
    that.newNoteSave = function() {
      that.repo.addNote({text: that.newNoteText()}).then(function(note) {
        that.newNoteText(null);
        that.notes.splice(0, 0, note);
      }).fail(function(error) {
        that.messages().push('Error initializing: ' + JSON.stringify(error));
      }).done();
    };
    
    that.noteDelete = function(note) {
      that.repo.deleteNote(note).then(function() {
        that.notes.splice(that.notes.indexOf(note), 1);
      }).fail(function(error) {
        that.messages().push('Error initializing: ' + JSON.stringify(error));
      }).done();
    };
    
    // Initializing.
    that.repo.getAllNotes().then(function(notes) {
      that.notes(notes);
    }).fail(function(error) {
      that.messages().push('Error initializing: ' + JSON.stringify(error));
    }).fin(function() {
      that.initializing(false);
    }).done();
  };
});