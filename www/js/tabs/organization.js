FduHangoutApp
  .config(function ($stateProvider) {
    $stateProvider.state('organization', {
      url: '/organization',
      templateUrl: 'js/tabs/organization.html',
      params: {
        id: -1,
        name: "",
        info_html: "",
        contact_html: ""
      }
    })
  })

  .controller('TabOrganizationController',
  function ($scope, $stateParams, dataService, utilService, urlParserService, $ionicPopup, $location, $state, $ionicHistory, $ionicPopover, $q, $ionicLoading, dataShareService) {
    var self = this;
    $scope.data = $stateParams;
  });
