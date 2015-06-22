FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('big-avatar', {
      url: '/big-avatar',
      templateUrl: 'js/user/big-avatar.html'
    })
  })

  .controller('BigAvatarController',
  function ($scope) {

  });
