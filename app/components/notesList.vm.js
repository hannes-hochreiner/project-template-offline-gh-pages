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