FduHangoutApp.directive('bindHtmlCompile', ['$compile', function ($compile) {

  function filter(val) {
    if (val) {
      val = val.replace(/<img src=/, "<img ly-src=");
    }
    return val;
  }

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(function () {
        return scope.$eval(attrs.bindHtmlCompile);
      }, function (value) {
        element.html(filter(value));
        $compile(element.contents())(scope);
      });
    }
  };
}]);