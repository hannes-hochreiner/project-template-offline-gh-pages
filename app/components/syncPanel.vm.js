if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {
  return function(params) {
    var that = this;
    
    that.ko = params.ko;
    that.repo = params.repo;
    
    that.initializing = that.ko.observable(true);
    that.editing = that.ko.observable(false);
    that.syncEndpoint = that.ko.observable();
    that.newSyncEndpoint = that.ko.observable();
    that.syncEndpointObj;
    
    that.syncEndpointEdit = function() {
      that.newSyncEndpoint(that.syncEndpoint());
      that.editing(true);
    };
    
    that.sync = function() {
      that.repo.sync(that.syncEndpointObj.value).then(function(res) {
        alert(JSON.stringify(res));
      }).fail(function(error) {
        alert(JSON.stringify(error));
      }).done();
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
    
    that.repo.getConfig('syncEndpoint').then(function(res) {
      m2vm(res);
    }).fail(function(error) {
      alert(JSON.stringify(error));
    }).fin(function() {
      that.initializing(false);
    }).done();
  };
});
