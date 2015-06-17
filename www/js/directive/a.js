FduHangoutApp.directive('a', function (urlParserService) {
  return {

    restrict: 'E',

    link: function (scope, element, attrs) {
      if (!attrs.href) {
        return;
      }
      var url = attrs.href;

      element.on('click', function (e) {
        e.preventDefault();
        if (urlParserService.navigate(url)) {
          return;
        }
        if (attrs.ngClick) {
          scope.$eval(attrs.ngClick);
        }
        // window.open(encodeURI(url), '_system');
      });
    }
  }
});