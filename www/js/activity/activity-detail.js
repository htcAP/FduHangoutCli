FduHangoutApp
  .config(function ($stateProvider) {
    $stateProvider.state('activity-detail', {
      url: '/activity-detail?id',
      templateUrl: 'js/activity/activity-detail.html'
    })
  })

  .service('ActivityDetailHelper', function () {
    return {
      id: null
    }
  })

  .controller('ActivityDetailController',
  function ($scope, dataService, ActivityDetailHelper, $ionicPopup, $location, $state, $ionicHistory, $timeout, utilService, $ionicModal, $ionicLoading, $stateParams, $ionicScrollDelegate, userService, nativeUrlPlugin, accountService, $rootScope, AUTH_EVENTS, activityService, mapPlugin, geoLocationService) {

    var data = $scope.data = {
      id: $stateParams.id,
      friends: userService.friendList,
      friendsToInvite: [],
      loading: true,
      loggedIn: false
    };

    $scope.openLogin = function () {
      $rootScope.$broadcast(AUTH_EVENTS.openLogin);
    };

    $scope.doInvite = function () {
      if ($scope.data.friendsToInvite.length == 0) {
        utilService.err("请选择至少一名好友", "邀请好友");
        return;
      }
      dataService.inviteFriends($scope.data.invite_title, $scope.data.invite_content, dataShareService.eventSeriesId, $scope.data.friendsToInvite).then(function (data) {
        console.log(data);
        utilService.toast('邀请成功！');
      });
      $scope.closeInvite();
    };

    $scope.openInvite = function () {
      data.friendsToInvite = [];
      data.invite_title = "邀请你与我一同参加" + data.name + "！";
      data.invite_content = "Hi，" + data.name + "很有趣，希望你能和我一起参加！";
      data.friends = userService.friendList;
      $scope.inviteModal.show();
    };
    $scope.closeInvite = function () {
      $scope.inviteModal.hide();
    };

    $scope.refresh = function (isPull, forceRefresh) {
      if (ActivityDetailHelper.id == data.id && !isPull && !forceRefresh) {
        return;
      }
      activityService.getInvitedList();

      ActivityDetailHelper.id = data.id;
      data.loading = false;
      data.loggedIn = accountService.loggedIn();
      $scope.data.loading = true;
      $ionicScrollDelegate.$getByHandle('activityScroll').scrollTop();
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        })
      }

      activityService.getActivity(data.id).then(function (recv) {
        //recv.distance = utilService.calcCrow(geoLocationService.lat, geoLocationService.lng, recv.location_lat,
        // recv.location_lng);
        data.activity = recv;
      }).finally(function () {
        data.loading = false;
        if (isPull) {
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          $ionicLoading.hide();
        }
        $ionicScrollDelegate.scrollTop();
      });
    };

    $scope.$on('$ionicView.enter', function () {
      data.loggedIn = accountService.loggedIn();
      $scope.$apply();
      $scope.refresh();
    });

    $scope.showLocation = function () {
      nativeUrlPlugin.showLocation(data.location_lat, data.location_lng, data.location);
    };

    $scope.isInvited = function () {
      var list = data.activity.invites;
      var selfId = accountService.userInfo.id;
      for (var i = 0; i < list.length; ++i) {
        if (list[i].user_id == selfId) {
          return list[i].invite_status == 0;
        }
      }
      return false;
    };

    $scope.acceptRequest = function () {
      activityService.replyInvite(data.id, true).then(function () {
        utilService.toast('成功参加');
        $scope.refresh(false, true);
      });
    };

    $scope.rejectRequest = function () {
      activityService.replyInvite(data.id, false).then(function () {
        utilService.toast('已残忍拒绝...');
        $scope.refresh(false, true);
      });
    };

    $scope.navigate = function () {
      if (data.activity.status == 0) {
        return;
      }
      var tm = data.activity.timeLocations[0];
      mapPlugin.directionIntent(tm.latitude, tm.longitude, geoLocationService.lat, geoLocationService.lng);
    }

  });