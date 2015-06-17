FduHangoutApp
  .config(function ($stateProvider) {
    $stateProvider.state('rating', {
      url: '/rating',
      templateUrl: 'js/tabs/rating.html',
      params: {
        ratingData: []
      }
    })
  })

  .controller('TabRatingController',
  function ($scope, $stateParams, dataService, utilService, urlParserService, $ionicPopup, $location, $state, $ionicHistory, $ionicPopover, $q, $ionicLoading, dataShareService) {
    var self = this;
    $scope.data = $stateParams;
  });
