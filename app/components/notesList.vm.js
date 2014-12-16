define([
  'knockout',
  'jquery'
], function(ko, $) {
  return function(params) {
    var that = this;
    
    that.repo = params.repo;
    
    // Initializing.
//     $.when(
//       that.repo.getAllLabs(),
//       that.repo.getAllOrders()
//     )
//     .done(function(labs, orders) {
//       that.labs(labs);
//       that.entries(orders);
//       that.loading(false);
//     });
  };
});