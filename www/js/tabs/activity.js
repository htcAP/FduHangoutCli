FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('tab.activity', {
      url: '/tab/activity',
      views: {
        'tab-activity': {
          templateUrl: 'js/tabs/activity.html'
        }
      }
    })
  })

  .controller('TabActivityController',
  function ($scope, dataService, utilService, urlParserService, $ionicPopup, $location, $state, $ionicHistory, $ionicPopover, $q, $ionicLoading, dataShareService, geoLocationService, dataShareService) {

    var self = this;

    var curOperation = $q.defer();
    var curOpID = 0;
    curOperation.resolve();

    $scope.sorts = [{"id": 0, "name": "无排序"},
      {"id": 1, "name": "时间由近到远"},
      {"id": 2, "name": "距离由近到远"},
      {"id": 3, "name": "评价最高"}];
    $scope.categories = [{id: 0, name: "全部"}, {"id": "1", "name": "\u6559\u80b2\u52a9\u5b66"}, {
      "id": "2",
      "name": "\u7eff\u8272\u73af\u4fdd"
    }, {"id": "3", "name": "\u52a9\u6b8b\u656c\u8001"}, {"id": "4", "name": "\u6276\u8d2b\u8d48\u707e"}, {
      "id": "5",
      "name": "\u793e\u533a\u5fd7\u613f"
    }, {"id": "6", "name": "\u5987\u5973\u513f\u7ae5"}, {"id": "7", "name": "\u536b\u751f\u533b\u7597"}, {
      "id": "8",
      "name": "\u5fc3\u7406\u5065\u5eb7"
    }, {"id": "9", "name": "\u52a8\u7269\u4fdd\u62a4"}, {"id": "10", "name": "\u4eba\u6587\u827a\u672f"}];

    $scope.data = {
      searchStr: "",
      availableOnly: false,
      filterBy: 0,
      sortBy: 0,
      categoryName: "全部"
    };

    //console.log($scope.data);

    $scope.activities = [];
    $scope.moreDataCanBeLoaded = true;
    $scope.loading = false;
    $scope.activitiesPerPage = 6;
    $scope.showSearchBtn = function (show) {
      if ($scope.data.searchStr != "") {
        $("#searchBtn").fadeIn();
      } else {
        $("#searchBtn").fadeOut();
      }
    };


    $scope.search = function () {
      $("#searchBox").attr("disabled", "disabled");
      $("#searchBtn").css("display", "none");
      $("#filterBtn").css("display", "none");
      $("#sortBtn").css("display", "none");
      $("#closeSearchBtn").css("display", "");
      $scope.refresh();
    };

    $scope.closeSearch = function () {
      $("#searchBox").removeAttr("disabled");
      $("#filterBtn").css("display", "");
      $("#sortBtn").css("display", "");
      $("#closeSearchBtn").css("display", "none");
      $scope.data.searchStr = "";
      $scope.refresh();
    };

    function genParam() {
      var param = {
        start: $scope.activities.length,
        count: $scope.activitiesPerPage,
        categoryID: $scope.data.filterBy,
        search: $scope.data.searchStr,
        mineOnly: false,
        availableOnly: $scope.data.availableOnly,
        sortBy: $scope.data.sortBy
      };
      if (dataShareService.lat != 0) {
        param.lat = dataShareService.lat;
        param.lng = dataShareService.lng;
      }
      return param;
    }

    $scope.loadMore = function () {
      /*
       if($scope.loading) {
       $scope.$broadcast('scroll.infiniteScrollComplete');
       return;
       }
       */
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


    $ionicPopover.fromTemplateUrl('js/tabs/activity-popover-filter.html', {
      scope: $scope,
      width: 1000
    }).then(function (popover) {
      $scope.filter_popover = popover;
    });

    $ionicPopover.fromTemplateUrl('js/tabs/activity-popover-sort.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.sort_popover = popover;
    });

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
        $scope.moreDataCanBeLoaded = (activities.length != 0);
        $scope.data.categoryName = $scope.categories[$scope.data.filterBy];

      }).finally(function () {
        if (isPull) {
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          $ionicLoading.hide();
        }
      });
    };
    $scope.refresh();

    $scope.showActivity = function (id) {
      if (dataShareService.eventSeriesId != id) {
        $("#ActivityDetailDiv").css("display", "none");
      }
      dataShareService.eventSeriesId = id;
      $state.go("activity-detail");
    };

    $scope.openFilterPopover = function ($event) {
      $scope.filter_popover.show($event);
    };
    $scope.openSortPopover = function ($event) {
      $scope.sort_popover.show($event);
    };
    $scope.filterConfirm = function (id) {
      $scope.data.filterBy = id;
      $scope.filter_popover.hide();
      $scope.refresh();
    };
    $scope.sortConfirm = function (id) {
      $scope.data.sortBy = id;
      $scope.sort_popover.hide();
      $scope.refresh();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.filter_popover.remove();
      $scope.sort_popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });

  });
