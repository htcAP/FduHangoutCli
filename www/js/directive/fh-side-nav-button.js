FduHangoutApp.directive('fhSideNavButton', function ($rootScope, userService) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      var el = $(element);
      el.sideNav({
          menuWidth: 300, // Default is 240
          edge: 'left', // Choose the horizontal origin
          closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
      );
      el.on('click', function () {
        userService.getFriendRequest();
      });

      $rootScope.showSideNav = function () {
        $(element).sideNav('show');
      };
      $rootScope.hideSideNav = function () {
        $(element).sideNav('hide');
      }
    }
  };
});