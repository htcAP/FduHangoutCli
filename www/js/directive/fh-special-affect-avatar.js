FduHangoutApp.directive('fhSpecialAffectAvatar', function ($ionicScrollDelegate, $timeout) {
  return {
    restrict: 'E',

    compile: function (elem, attr) {
      elem.addClass("fh-se-avatar-container");
      var innerImg = angular.element('<img class="fh-se-avatar" src="' + attr.src + '">');
      innerImg.append(elem.contents());
      elem.append(innerImg);

      return {
        pre: function () {
          $timeout(function () {
            var scrollHandle = $ionicScrollDelegate.$getByHandle(attr.scrollHandle);
            scrollHandle.getScrollView().onScroll = function () {
              var scrollTop = scrollHandle.getScrollPosition().top;
              innerImg.css('top', (scrollTop / 2) + 'px');
            }
          }, 0);

        }
      };
    }

  };
});
