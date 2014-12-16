if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['../app/components/notesList.vm.js',
       '../lib/knockout/knockout-3.2.0',
       '../lib/q/q'
], function(NotesList, ko, Q) {
  var obj = {};
  
  obj.notesListInitFail = function(test) {
    var def = Q.defer();
    var nl = new NotesList({ ko: ko, repo: {
      getAllNotes: function() { return def.promise; }
    } });
    
    test.expect(7);
    
    test.ok(nl, 'Could not create notes list.');
    test.equal(true, nl.initializing());
    test.equal(0, nl.messages().length);
    test.equal(0, nl.notes().length);
    
    def.reject(new Error('test'));
    
    Q.delay(50).then(function() {
      test.equal(false, nl.initializing());
      test.equal(1, nl.messages().length);
      test.equal(0, nl.notes().length);
      
      test.done();
    });
  };

  obj.notesListInitSuccess = function(test) {
    var def = Q.defer();
    var nl = new NotesList({ ko: ko, repo: {
      getAllNotes: function() { return def.promise; }
    } });
    
    test.expect(7);
    
    test.ok(nl, 'Could not create notes list.');
    test.equal(true, nl.initializing());
    test.equal(0, nl.messages().length);
    test.equal(0, nl.notes().length);
    
    def.resolve([ {}, {} ]);
    
    Q.delay(50).then(function() {
      test.equal(false, nl.initializing());
      test.equal(0, nl.messages().length);
      test.equal(2, nl.notes().length);
      
      test.done();
    });
  };
  
  return obj;
});