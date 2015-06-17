FduHangoutApp.directive('fhAutoFocus', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function () {
        element[0].focus();
        //if (window.plugins)
        //  cordova.plugins.Keyboard.show();
      }, 600);
    }
  };
});