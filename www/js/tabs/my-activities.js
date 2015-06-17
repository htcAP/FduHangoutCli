FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('my-activities', {
      url: '/my-activities',
      templateUrl: 'js/tabs/my-activities.html'
    })
  })

  .controller('TabMyActivitiesController',
  function ($scope, dataService, utilService, urlParserService, $ionicPopup, $location, $state, $ionicHistory, $ionicPopover, $q, $ionicLoading, dataShareService, geoLocationService) {

    var self = this;

    var curOperation = $q.defer();
    var curOpID = 0;
    curOperation.resolve();

    $scope.activities = [];
    $scope.moreDataCanBeLoaded = true;
    $scope.loading = false;
    $scope.activitiesPerPage = 6;


    function genParam() {
      var param = {
        start: $scope.activities.length,
        count: $scope.activitiesPerPage,
        mineOnly: true
      };
      return param;
    }

    $scope.loadMore = function () {
      $scope.loading = true;
      //console.log('loadMore');
      curOperation.then(function () {
        var defer = $q.defer();
        var opID = curOpID;

        dataService.getActivityList(genParam()).then(function (activities) {
          if (curOpID != opID) {
            // cancelled
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
          }
          activities.forEach(function (d) {
            d.statusDescription = utilService.getEventStatusDescription(d.status);
            console.log(d);
            $scope.activities.push(d);
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if (activities.length < $scope.activitiesPerPage)
            $scope.moreDataCanBeLoaded = false;
          $scope.loading = false;
          defer.resolve();
        });

        return defer.promise;
      });
    };

    $scope.refresh = function (isPull) {
      ++curOpID;
      $scope.activities.length = 0;
      $scope.loading = true;
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        });
      }

      curOperation = dataService.getActivityList(genParam()).then(function (activities) {
        activities.forEach(function (d) {
          d.statusDescription = utilService.getEventStatusDescription(d.status);
          $scope.activities.push(d);
        });
        $scope.activities = activities;
        $scope.loading = false;
        $scope.moreDataCanBeLoaded = (activities.length == $scope.activitiesPerPage);

      }).finally(function () {
        if (isPull) {
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          $ionicLoading.hide();
        }
      });
    };
    $scope.refresh();

    $scope.cancelSignup = function (id) {
      dataShareService.delegate_activitydetail_action = 0;
      $scope.showActivity(id);
      return false;
    };
    $scope.rate = function (id) {
      dataShareService.delegate_activitydetail_action = 1;
      $scope.showActivity(id);
      return false;
    };
    $scope.inviteFriends = function (id) {
      dataShareService.delegate_activitydetail_action = 2;
      $scope.showActivity(id);
      return false;
    };
    $scope.showActivity = function (id) {
      if (dataShareService.eventSeriesId != id) {
        $("#ActivityDetailDiv").css("display", "none");
      }
      dataShareService.eventSeriesId = id;
      $state.go("activity-detail");
    };
  });
