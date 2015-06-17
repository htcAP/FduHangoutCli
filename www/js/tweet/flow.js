FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('tweet-flow', {
      url: '/tweet-flow?id',
      templateUrl: 'js/tweet/flow.html'
    })
  })

  .controller('TweetFlowController',
  function ($scope, tweetService, $ionicScrollDelegate, accountService, $stateParams, userService) {

    var data = $scope.data = {
      tweets: [],
      loading: true,
      id: $stateParams.id,
      name: ''
    };

    if (data.id) {
      if (data.id == accountService.userInfo.id) {
        data.isSelf = true;
        data.name = '我';
      } else {
        data.name = userService.getCachedUser(data.id).name;
      }
    } else {
      data.isSelf = true;
      data.name = '好友';
    }

    var loaded;
    var scroll;
    var tweetPerPage = 8;
    var curOpID = 0;
    var savedScrollTop = 0;

    $scope.refresh = function () {
      ++curOpID;
      data.loading = true;

      tweetService.getTweets(data.id, 0, tweetPerPage).then(function (tweets) {
        data.tweets = tweets;
        data.moreDataCanBeLoaded = (tweets.length == tweetPerPage);
        tweetService.removeNewTweetNotification().then(function () {
          accountService.refreshNotification();
        });

      }).finally(function () {
        data.loading = false;
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      if (!loaded) {
        loaded = true;
        $scope.refresh();
      } else {
        $ionicScrollDelegate.$getByHandle('flowScroll').scrollTo(0, savedScrollTop);
      }
    });

    $scope.$on('$ionicView.beforeLeave', function () {
      var obj = $ionicScrollDelegate.$getByHandle('flowScroll').getScrollPosition();
      savedScrollTop = obj ? obj.top : 0;
    });

    $scope.loadMore = function () {
      $scope.loading = true;
      var opID = curOpID;

      tweetService.getTweets(data.id, data.tweets.length, tweetPerPage).then(function (tweets) {
        if (curOpID != opID) {
          // cancelled
          return;
        }
        if (tweets.length < tweetPerPage) {
          data.moreDataCanBeLoaded = false;
        }

        data.tweets = data.tweets.concat(tweets);

      }, function () {
        data.moreDataCanBeLoaded = false;
      }).finally(function () {
        data.loading = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

  });
