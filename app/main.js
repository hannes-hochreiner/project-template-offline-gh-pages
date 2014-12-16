require.config({
  paths: {
    knockout: '../lib/knockout/knockout-3.2.0',
    jquery: '../lib/jquery/jquery-2.1.1.min',
    domReady: '../lib/require/domReady',
    text: '../lib/require/text'
  }
});

require([
  'knockout',
  'repo',
  'utils',
  'domReady!'
], function(ko, Repo, Utils) {
  ko.components.register('notes-list', { require: 'components/notesList' });
  
  function AppViewModel(repo) {
    var that = this;
    
    that.repo = repo;
  }

  ko.applyBindings(new AppViewModel(new Repo(new Utils())));
});
