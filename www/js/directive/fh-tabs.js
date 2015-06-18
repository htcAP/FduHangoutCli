FduHangoutApp.directive('fhTabs', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      $(element).tabs();
    }
  };
});