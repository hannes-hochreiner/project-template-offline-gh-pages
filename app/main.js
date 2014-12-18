require.config({
  paths: {
    knockout: '../lib/knockout/knockout-3.2.0',
    jquery: '../lib/jquery/jquery-2.1.1.min',
    domReady: '../lib/require/domReady',
    text: '../lib/require/text',
    q: '../lib/q/q',
    pouchdb: '../lib/pouchdb/pouchdb-3.2.0.min'
  }
});

require([
  'knockout',
  'repo',
  'utils',
  'pouchdb',
  'domReady!'
], function(ko, Repo, Utils, PouchDb) {
  ko.components.register('notes-list', { require: 'components/notesList' });
  
  function AppViewModel(repo) {
    var that = this;
    
    that.repo = repo;
    that.ko = ko;
  }

  ko.applyBindings(new AppViewModel(new Repo(new Utils(), new PouchDb('project-template'))));
});
