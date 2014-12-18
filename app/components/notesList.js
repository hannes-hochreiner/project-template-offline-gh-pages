define([
  './notesList.vm',
  'text!./notesList.html'
], function(viewModel, template) {
  return { viewModel: viewModel, template: template };
});
