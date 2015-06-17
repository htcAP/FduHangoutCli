FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main.rec', {
      url: '/main/rec',
      views: {
        'mainContent': {
          templateUrl: 'js/tabs/recommendation.html'
        }
      }
    })
  })

  .controller('TabRecommendationController',
  function ($scope, dataService, utilService, $ionicPopup, $location, $state, $ionicHistory, $ionicSlideBoxDelegate, urlParserService, dataShareService) {
    var self = this;
    this.urlParserService = urlParserService;

    $scope.showActivity = function (id) {
      dataShareService.eventSeriesId = id;
      $state.go("activity-detail");
    };
    $scope.discoverMore = function () {
      $state.go("tab.activity");
    };

    dataService.getCarousels().then(function (carousels) {
      $scope.carousels = carousels;
      $ionicSlideBoxDelegate.update();
    });

    dataService.getRecommendation().then(function (data) {
      $scope.featured = data.featured;
      $scope.recommendation = data.recommendation;
      $scope.closest = data.closest;
      $scope.news = data.news;

      [$scope.featured, $scope.recommendation, $scope.closest].forEach(function (data) {
        //console.log(data);
        data.forEach(function (d) {
          d.event_pic = utilService.toAbsoluteURL(d.event_pic);
        });
      });
      $scope.news.forEach(function (d) {
        d.news_pic = utilService.toAbsoluteURL(d.news_pic);
      });

      setTimeout(function () {
        navigator.splashscreen.hide();
      }, 0);
    });

  });