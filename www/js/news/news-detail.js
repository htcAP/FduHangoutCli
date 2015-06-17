FduHangoutApp
  .config(function ($stateProvider) {
    $stateProvider.state('news-detail', {
      url: '/news-detail?id',
      templateUrl: 'js/news/news-detail.html'
    })
  })

  .controller('NewsDetailController',
  function ($scope, $stateParams, dataService, $ionicPopup, $location, $state, $ionicHistory, $timeout, eventApiService, utilService, dataShareService) {
    $scope.data = {html: "", title: "", news_pic: ""};
    dataService.getNewsDetail($stateParams.id).then(function (data) {
      $scope.data = data;
      $scope.eventStatusDescription = utilService.getEventStatusDescription(data.event_status);
    });

    $scope.showActivityDetail = function (id) {
      dataShareService.eventSeriesId = id;
      $state.go("activity-detail");
    }
  });