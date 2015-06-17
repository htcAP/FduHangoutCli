FduHangoutApp
  .config(function ($stateProvider) {
    $stateProvider.state('activity-detail', {
      url: '/activity-detail',
      templateUrl: 'js/activity/activity-detail.html'
    })
  })

  .controller('ActivityDetailController',
  function ($scope, dataService, $ionicPopup, $location, $state, $ionicHistory, $timeout, eventApiService, utilService, $ionicModal, $ionicLoading, $stateParams, dataShareService, $ionicScrollDelegate, userService, nativeUrlPlugin, accountService, $rootScope, AUTH_EVENTS) {

    var data = $scope.data = {
      id: -1,
      friends: userService.friendList,
      friendsToInvite: [],
      loading: true,
      loggedIn: false
    };
    var skipReloadOnLeave = false;

    $scope.openLogin = function () {
      $rootScope.$broadcast(AUTH_EVENTS.openLogin);
    };

    $scope.optionsChanged = function (id) {
      dataShareService.eventSeriesId = id;
      $scope.refresh();
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

    $scope.selectEventSeries = function (behavior) {
      skipReloadOnLeave = true;
      var title = "";
      if (!$scope.data || !$scope.data.otherEventSeries.length) {
        return;
      }
      switch (behavior) {
        case 0:
          title = '选择其它的活动';
          break;
        case 1:
          title = '其他可选时间';
          break;
        case 2:
          title = '其他可选地点';
          break;
      }
      var list = angular.map($scope.data.otherEventSeries, function (event) {
        var name = "", html = "";
        switch (behavior) {
          case 0:
            name = '时间：' + event.datetime + '\n地点： ' + event.location;
            html = utilService.getEventStatusDescription(event.status);
            break;
          case 1:
            name = event.datetime;
            html = utilService.getEventStatusDescription(event.status);
            break;
          case 2:
            name = event.location;
            html = utilService.getEventStatusDescription(event.status);
            break;

        }
        return {
          id: event.event_series_id,
          name: name,
          html: html,
          distance: dataShareService.lat == 0 ? null : utilService.calcCrow(dataShareService.lat, dataShareService.lng, parseFloat(event.location_lat), parseFloat(event.location_lng))
        }
      });

      $state.go('select', {
        param: {
          title: title,
          list: list,
          callback: function (item) {
            data.loading = true;
            //$("#ActivityDetailDiv").css("display", "none");
            dataShareService.eventSeriesId = item.id;
            $ionicHistory.goBack();
          }
        }
      });
    };
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
      if (!isPull && !forceRefresh && dataShareService.eventSeriesId === data.id) {
        data.loading = false;
        data.loggedIn = accountService.loggedIn();
        if (dataShareService.delegate_activitydetail_action != -1) {
          switch (dataShareService.delegate_activitydetail_action) {
            case 0:
              $scope.openCancelSignup();
              break;
            case 1:
              $scope.openRate();
              break;
            case 2:
              $scope.openInvite();
              break;
          }
          dataShareService.delegate_activitydetail_action = -1;
        }
        return;
      }
      $scope.data.loading = true;
      $ionicScrollDelegate.scrollTop();
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        })
      }
      $scope.toggleFriendSelection = function (friend) {
        var idx = $scope.data.friendsToInvite.indexOf(friend.id);

        if (idx > -1) {
          $scope.data.friendsToInvite.splice(idx, 1);
        } else {
          $scope.data.friendsToInvite.push(friend.id);
        }
      };

      dataService.getActivityDetail(dataShareService.eventSeriesId).then(function (recv) {
        recv.distance = utilService.calcCrow(dataShareService.lat, dataShareService.lng, recv.location_lat, recv.location_lng);
        angular.copy(recv, data);
        data.id = dataShareService.eventSeriesId;
        data.loggedIn = accountService.loggedIn();
        $scope.eventStatusDescription = utilService.getEventStatusDescription(recv.status);

        if (dataShareService.delegate_activitydetail_action != -1) {
          switch (dataShareService.delegate_activitydetail_action) {
            case 0:
              $scope.openCancelSignup();
              break;
            case 1:
              $scope.openRate();
              break;
            case 2:
              $scope.openInvite();
              break;
          }
          dataShareService.delegate_activitydetail_action = -1;
        }

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