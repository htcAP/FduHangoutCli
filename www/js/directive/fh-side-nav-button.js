FduHangoutApp.directive('fhSideNavButton', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      $(element).sideNav({
          menuWidth: 300, // Default is 240
          edge: 'left', // Choose the horizontal origin
          closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
      );
    }
  };
});