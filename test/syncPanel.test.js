if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['../app/components/syncPanel.vm.js',
       '../lib/knockout/knockout-3.2.0',
       '../lib/q/q',
       '../lib/pubsub/pubsub-1.5.0'
], function(SyncPanel, ko, Q, pubsub) {
  var obj = {};
  
  obj.syncPanelInitNoEndpoint = function(test) {
    var def = Q.defer();
    var sp = new SyncPanel({
      ko: ko,
      repo: {
        getConfig: function(key) {
          if (key === 'syncEndpoint') {
            return def.promise;
          }
          
          throw new Error('Enexpected key requested from configuration: ' + key);
        }
      },
      pubsub: pubsub
    });
    
    test.expect(5);
    
    test.ok(sp, 'Could not create sync panel.');
    test.equal(true, sp.initializing());
    
    def.resolve();
    
    Q.delay(50).then(function() {
      test.equal(false, sp.initializing());
      test.ok(!sp.syncPossible());
      test.ok(!sp.synchronizing());
    }).fin(function() {
      test.done();
    }).done(null, function(error) {
      console.log(error);
    });
  };

  obj.syncPanelInitEndpoint = function(test) {
    var def = Q.defer();
    var st = {};
    var sp = new SyncPanel({
      ko: ko,
      repo: {
        getConfig: function(key) {
          if (key === 'syncEndpoint') {
            return def.promise;
          }
          
          throw new Error('Enexpected key requested from configuration: ' + key);
        },
        sync: function() {
          return st;
        }
      },
      pubsub: pubsub
    });
    
    test.expect(6);
    
    test.ok(sp, 'Could not create sync panel.');
    test.equal(true, sp.initializing());
    
    def.resolve({ value: 'test' });
    
    Q.delay(50).then(function() {
      test.equal(false, sp.initializing(), 'Initialization not completed.');
      test.ok(sp.syncPossible(), 'Synchronization not possible.');
      test.equal('test', sp.syncEndpoint(), 'Synchronization endpoint incorrect.');
      test.ok(sp.synchronizing(), 'Not synchronizing.');
    }).fin(function() {
      test.done();
    }).done(null, function(error) {
      console.log(error);
    });
  };
  
  return obj;
});
