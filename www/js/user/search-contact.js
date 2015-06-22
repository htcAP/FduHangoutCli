FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('search-contact', {
      url: '/search-contact',
      templateUrl: 'js/user/search-contact.html'
    })
  })

  .controller('SearchContactController',
  function ($scope, $ionicLoading, $cordovaContacts, utilService, userService) {

    var data = $scope.data = {
      loading: false
    };

    $scope.searchContact = function () {
      data.loading = true;

      $ionicLoading.show({
        template: '正在扫描通讯录哦~耐心等待汪~'
      });

      navigator.contactsPhoneNumbers.list(function (contacts) {
        var phoneNumberMap = {};
        for (var i = 0; i < contacts.length; i++) {
          for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
            var phone = contacts[i].phoneNumbers[j].normalizedNumber;
            phone = phone.substr(phone.length - 11);
            if (phone.length != 11) {
              continue;
            }
            phoneNumberMap[phone] = 1;
          }
        }

        var phoneNumbers = [];
        for (var phone in phoneNumberMap) {
          if (phoneNumberMap.hasOwnProperty(phone)) {
            phoneNumbers.push(phone);
          }
        }
        utilService.toast('找到了' + phoneNumbers.length + '个手机号码');


        $ionicLoading.hide();
        $ionicLoading.show({
          template: '查询中...'
        });
        userService.searchContact(phoneNumbers).then(function (users) {
          console.log(users);
          data.users = users;
        }).finally(function () {
          $ionicLoading.hide();
          data.loading = false;
          $scope.$broadcast('scroll.refreshComplete');
        });

      }, function (error) {
        utilService.error('汪呜...出错了 ' + errorMsg);
        $ionicLoading.hide();
        data.loading = false;
        $scope.$broadcast('scroll.refreshComplete');
      })

    };

    $scope.searchContact();

  });
