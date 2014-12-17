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
    }).done();
  };
  
  obj.notesListNewEntry = function(test) {
    var allNotesDef = Q.defer();
    var addNoteDef = Q.defer();
    var addNoteObj;
    var nl = new NotesList({ ko: ko, repo: {
      getAllNotes: function() { return allNotesDef.promise; },
      addNote: function(obj) {
        addNoteObj = obj;
        return addNoteDef.promise;
      }
    } });
    
    test.expect(8);
    
    allNotesDef.resolve([ {
      _id: 0,
      text: 'testnote 1'
    }, {
      _id: 1,
      text: 'testnote 2'
    } ]);
    
    Q.delay(50).then(function() {
      test.equal(false, nl.initializing());
      test.equal(0, nl.messages().length);
      test.equal(2, nl.notes().length);
      
      nl.newNoteText('testnote 3');
      nl.newNoteSave();
      
      test.deepEqual({text: 'testnote 3'}, addNoteObj);
      
      addNoteDef.resolve({_id: 2, text: 'testnote 3'});
    }).delay(50).then(function() {
      test.equal(0, nl.messages().length);
      test.equal(3, nl.notes().length);
      test.equal(null, nl.newNoteText());
      test.deepEqual({_id: 2, text: 'testnote 3'}, nl.notes()[0]);
    }).fail(function(error) {
      console.log(error);
    }).fin(function() {
      test.done();
    }).done();
  };
  
  obj.notesListDeleteEntry = function(test) {
    var allNotesDef = Q.defer();
    var deleteNoteDef = Q.defer();
    var deleteNoteObj;
    var nl = new NotesList({ ko: ko, repo: {
      getAllNotes: function() { return allNotesDef.promise; },
      deleteNote: function(obj) {
        deleteNoteObj = obj;
        return deleteNoteDef.promise;
      }
    } });
    
    test.expect(7);
    
    allNotesDef.resolve([ {
      _id: 0,
      text: 'testnote 1'
    }, {
      _id: 1,
      text: 'testnote 2'
    } ]);
    
    Q.delay(50).then(function() {
      test.equal(false, nl.initializing());
      test.equal(0, nl.messages().length);
      test.equal(2, nl.notes().length);
      
      nl.noteDelete(nl.notes()[1]);
      
      test.deepEqual({_id: 1, text: 'testnote 2'}, deleteNoteObj);
      
      deleteNoteDef.resolve();
    }).delay(50).then(function() {
      test.equal(0, nl.messages().length);
      test.equal(1, nl.notes().length);
      test.deepEqual({_id: 0, text: 'testnote 1'}, nl.notes()[0]);
    }).fail(function(error) {
      console.log(error);
    }).fin(function() {
      test.done();
    }).done();
  };
  
  return obj;
});