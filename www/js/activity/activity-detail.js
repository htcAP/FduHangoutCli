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
  function ($scope, dataService, ActivityDetailHelper, $ionicPopup, $location, $state, $ionicHistory, $timeout, utilService, $ionicModal, $ionicLoading, $stateParams, $ionicScrollDelegate, userService, nativeUrlPlugin, accountService, $rootScope, AUTH_EVENTS, activityService) {

    var data = $scope.data = {
      id: $stateParams.id,
      friends: userService.friendList,
      friendsToInvite: [],
      loading: true,
      loggedIn: false
    };
    var skipReloadOnLeave = false;

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
    $scope.closeSignup = function () {
      $scope.confirmModal.hide();
    };
    $scope.openSignup = function () {
      $scope.confirmModal.show();
    };
    $scope.openRate = function () {
      $scope.data.myRate = {
        rating: 5,
        comment: ""
      };
      $scope.rateModal.show();
    };
    $scope.closeRate = function () {
      $scope.rateModal.hide();
    };
    $scope.openCancelSignup = function () {
      $scope.cancelConfirmModal.show();
    };
    $scope.closeCancelSignup = function () {
      $scope.cancelConfirmModal.hide();
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

    $ionicModal.fromTemplateUrl('js/activity/confirm.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.confirmModal = modal;
    });
    $ionicModal.fromTemplateUrl('js/activity/cancel-confirm.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.cancelConfirmModal = modal;
    });
    $ionicModal.fromTemplateUrl('js/activity/invite-friend.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.inviteModal = modal;
    });
    $ionicModal.fromTemplateUrl('js/activity/rate.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.rateModal = modal;
    });


    $scope.submitRate = function () {
      dataService.rateEvent(dataShareService.eventSeriesId, data.myRate.rating, data.myRate.comment).then(function (data) {
        utilService.toast('评价成功！');
        $scope.closeRate();
        $scope.refresh();
      });
    };

    $scope.showOrg = function (id) {
      skipReloadOnLeave = true;
      $state.go("organization", {
        id: parseInt(data.organization_id),
        name: data.org_name,
        info_html: data.org_info_html,
        contact_html: data.org_contact_html
      });
    };

    $scope.showRatings = function () {
      skipReloadOnLeave = true;
      $state.go("rating", {
        ratingData: $scope.data.ratings
      });
    };

    $scope.cancelSignupEvent = function () {
      $ionicLoading.show({
        template: '取消中...'
      });
      eventApiService.cancelSignupEventSeries(dataShareService.eventSeriesId).then(function () {
        utilService.toast('取消成功');
        $scope.closeCancelSignup();
        $scope.refresh(false, true);
      }).finally(function () {
        $ionicLoading.hide();
      })
    };
    $scope.signupEvent = function () {
      $ionicLoading.show({
        template: '报名中...'
      });
      eventApiService.signupEventSeries(dataShareService.eventSeriesId).then(function () {
        utilService.toast('报名成功');
        $scope.closeSignup();
        $scope.refresh(false, true);
      }).finally(function () {
        $ionicLoading.hide();
      })
    };

    $scope.refresh = function (isPull, forceRefresh) {
      if (data.id === ActivityDetailHelper.id) {
        return;
      }
      ActivityDetailHelper.id = data.id;
      if (!isPull) {
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
      }
    };

    $scope.$on('$ionicView.enter', function () {
      data.loggedIn = accountService.loggedIn();
      $scope.$apply();
      $scope.refresh();
    });
    $scope.$on('$ionicView.leave', function () {
      if (skipReloadOnLeave)
        skipReloadOnLeave = false;
      else
        $scope.data.loading = true;
    });

    $scope.showLocation = function () {
      nativeUrlPlugin.showLocation(data.location_lat, data.location_lng, data.location);
    }
  });