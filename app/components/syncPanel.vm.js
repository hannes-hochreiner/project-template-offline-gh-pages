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
    that.editing = that.ko.observable(false);
    that.syncEndpoint = that.ko.observable();
    that.newSyncEndpoint = that.ko.observable();
    that.syncEndpointObj;
    that.syncTimestamp = that.ko.observable();
    that.syncToken = that.ko.observable();
    
    that.synchronizing = that.ko.pureComputed(function() {
      return !(typeof that.syncToken() === 'undefined' || that.syncToken() === null);
    });
    
    that.syncPossible = that.ko.pureComputed(function() {
      return typeof that.syncEndpoint() !== 'undefined' && that.syncEndpoint() !== '';
    });
    
    that.syncEndpointEdit = function() {
      that.newSyncEndpoint(that.syncEndpoint());
      that.editing(true);
    };
    
    that.syncStart = function() {
      if (typeof that.syncEndpointObj !== 'undefined') {
        that.syncToken(that.repo.sync(that.syncEndpointObj.value));
      }
    };
    
    that.syncStop = function() {
      var token = that.syncToken();
      
      if (typeof token === 'undefined' || token === null) {
        return;
      }
      
      token.cancel();
      that.syncToken(null);
    };
    
    that.newSyncEndpointSave = function() {
      that.repo.setConfig('syncEndpoint', vm2m()).then(function(res) {
        m2vm(res);
        that.editing(false);
      }).fail(function(error) {
        alert(JSON.stringify(error));
      }).done();
    };
    
    that.newSyncEndpointCancel = function() {
      that.editing(false);
    };
    
    function m2vm(model) {
      that.syncEndpointObj = model;
      that.syncEndpoint(that.syncEndpointObj.value);
    }
    
    function vm2m() {
      var clone = JSON.parse(JSON.stringify(that.syncEndpointObj || {}));
      
      clone.value = that.newSyncEndpoint();
      
      return clone;
    }
    
    function syncDone(msg, info) {
      that.syncTimestamp(new Date());
    }
    
    function syncError(msg, error) {
      var token = that.syncToken();
      
      if (!(typeof token === 'undefined' || token === null)) {
        token.cancel();
      }
      
      that.syncToken(null);
    }
    
    that.repo.getConfig('syncEndpoint').then(function(res) {
      if (typeof res !== 'undefined') {
        m2vm(res);
      }
    }).fail(function(error) {
      console.log(error);
    }).fin(function() {
      that.pubsub.subscribe('syncDone', syncDone);
      that.pubsub.subscribe('syncError', syncError);
      
      if (that.syncPossible()) {
        that.syncStart();
      }

      that.initializing(false);
    }).done(null, function(error) {
      console.log(error);
    });
  };
});
