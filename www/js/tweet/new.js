FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('new-tweet', {
      url: '/new-tweet',
      templateUrl: 'js/tweet/new.html'
    })
  })

  .controller('NewTweetController',
  function ($scope, tweetService, $ionicLoading, utilService, $ionicHistory) {
    var data = $scope.data = {
      content: ''
    };

    $scope.submit = function () {
      $ionicLoading.show({
        template: '发布中...'
      });
      tweetService.postTweet(data.content).then(function () {
        utilService.toast('发布成功');
        $ionicHistory.goBack();
      }).finally(function () {
        $ionicLoading.hide();
      })
    }


  });
