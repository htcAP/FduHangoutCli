FduHangoutApp.directive('fhSrc', function (utilService) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      attr.$observe('fhSrc', function (value) {
        if (!value) {
          return;
        }
        attr.$set('src', utilService.toAbsoluteURL(value));
      });
      attr.$set('src', utilService.toAbsoluteURL(attr.lySrc));
    }
  };
});
