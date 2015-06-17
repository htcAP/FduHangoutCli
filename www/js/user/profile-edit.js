FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('profile-edit', {
      url: '/profile-edit',
      templateUrl: 'js/user/profile-edit.html'
    });
  })

  .controller('ProfileEditController',
  function ($scope, accountService, $jrCrop, utilService, $ionicPopup, $ionicHistory, $q, $state, userService, touchPositionService, $ionicModal, $cordovaCamera) {

    var data = $scope.data = {};
    angular.copy(accountService.userInfo, data);
    processData();

    $scope.refresh = function () {
      accountService.getSelfInfo().then(function () {
        angular.extend(data, accountService.userInfo);
        processData();
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.getMailDesc = function (id) {
      return ["接收邮件", "仅重要邮件", "不接收邮件"][id];
    };

    $scope.getSMSDesc = function (id) {
      return ["接收短信", "仅重要短信", "不接收短信"][id];
    };

    $scope.confirmInput = function (modalName, value) {
      switch (modalName) {
        case "mailPopup":
          $scope.data.mailOption = value;
          $scope.mailPopup.close();
          break;
        case "smsPopup":
          $scope.data.smsOption = value;
          $scope.smsPopup.close();
          break;
        case "genderPopup":
          $scope.data.gender = value;
          $scope.genderPopup.close();
          break;
      }
    };
    $scope.selectMail = function () {
      $scope.mailPopup = $ionicPopup.show({
        template: '<ion-radio ng-model="data.mailOption" ng-value="0" ng-click=confirmInput("mailPopup",0)>接收邮件</ion-radio>' +
        '<ion-radio ng-model="data.mailOption" ng-value="1" ng-click=confirmInput("mailPopup",1)>仅重要邮件</ion-radio>' +
        '<ion-radio ng-model="data.mailOption" ng-value="2" ng-click=confirmInput("mailPopup",2)>不接收邮件</ion-radio>',
        title: '邮件设置',
        scope: $scope
      });
    };

    $scope.selectSMS = function () {
      $scope.smsPopup = $ionicPopup.show({
        template: '<ion-radio ng-model="data.smsOption" ng-value="0" ng-click=confirmInput("smsPopup",0)>接收短信</ion-radio>' +
        '<ion-radio ng-model="data.smsOption" ng-value="1" ng-click=confirmInput("smsPopup",1)>仅重要短信</ion-radio>' +
        '<ion-radio ng-model="data.smsOption" ng-value="2" ng-click=confirmInput("smsPopup",2)>不接收短信</ion-radio>',
        title: '短信设置',
        scope: $scope
      });
    };
    $scope.selectGender = function () {
      $scope.genderPopup = $ionicPopup.show({
        template: '<ion-radio ng-model="data.gender" ng-value="1" ng-click=confirmInput("genderPopup",1)>男</ion-radio>' +
        '<ion-radio ng-model="data.gender" ng-value="2" ng-click=confirmInput("genderPopup",2)>女</ion-radio>',
        title: '性别',
        scope: $scope
      });
    };

    $scope.selectBirthday = function () {
      plugins.datePicker.show({
        date: data.birthday ? new Date(data.birthday) : new Date(),
        x: window.innerWidth / 2,
        y: touchPositionService.data.y,
        mode: "date"
      }, function (returnDate) {
        if (returnDate) {
          var date = new Date(returnDate);
          data.birthday = utilService.getDateString(date);
          $scope.$apply();
        }
      });
    };

    function inputVal(key, title, type) {
      var originVal = data[key];
      var confirmed = false;
      var defer = $q.defer();

      //$ionicPopup.show({
      //  template: '<ion-item><input autofocus type="' + type + '" ng-model="data.' + key + '"></ion-item>',
      //  title: title,
      //  scope: $scope,
      //  closeOnBackdropClick: true,
      //  buttons: [{
      //    text: '确认',
      //    type: 'button-positive button',
      //    onTap: function (e) {
      //      if (!data[key]) {
      //        data[key] = originVal;
      //      }
      //      confirmed = true;
      //      defer.resolve();
      //    }
      //  }]
      //}).then(function () {
      //  if (!confirmed) {
      //    data[key] = originVal;
      //  }
      //});
      var modal = $scope.modal = $ionicModal.fromTemplate(
        //'<div class="ly-popup-container">' +
        '<div class="ly-popup">' +
        '<div class="popup-head">' +
        '<h3 class="popup-title">' + title + '</h3>' +
        '</div>' +
        '<div class="popup-body">' + '<ion-item><input type="' + type + '" ng-model="data.' + key + '"></ion-item>' +
        '</div>' +
        '<div class="popup-buttons">' +
        '<button class="button button-positive" ng-click="onPopupClick()">确认</button>' +
        '</div>' +
          //'</div>' +
        '</div>', {
          scope: $scope,
          animation: 'slide-in-up',
          focusFirstInput: true
        });
      $scope.onPopupClick = function (e) {
        //if (!data[key]) {
        //  data[key] = originVal;
        //}
        confirmed = true;
        modal.hide();
        defer.resolve();
      };
      modal.show();
      var cancelFn = $scope.$on('modal.hidden', function () {
        if (!confirmed) {
          data[key] = originVal;
        }
        cancelFn();
        modal.remove();
      });
      return defer.promise;
    }

    $scope.inputDescription = function () {
      inputVal('description', '个性签名', 'text')
    };

    $scope.inputSchool = function () {
      inputVal('school', '学校', 'text')
    };
    //
    //$scope.inputClassroom = function () {
    //  inputVal('classroom', '班级', 'text')
    //};

    $scope.inputQQ = function () {
      inputVal('qq', 'QQ', 'number')
    };

    $scope.inputWechat = function () {
      inputVal('wechat', '微信', 'text');
    };

    $scope.inputName = function () {
      inputVal('name', '姓名', 'text');
    };

    $scope.inputEmail = function () {
      data.emailToValidate = data.email;
      inputVal('emailToValidate', '邮箱', 'email').then(function () {
        if (!data.emailToValidate || data.email === data.emailToValidate) {
          return;
        }
        $state.go('validate-code', {
          title: '验证邮箱',
          subtitle: '邮箱验证码已发送至\n' + data.emailToValidate,
          actionName: '验证邮箱',

          action: function () {
            return userService.requestValidateEmail(data.emailToValidate);
          },

          validate: function (secCode) {
            userService.submitValidateEmail(data.emailToValidate, secCode).then(function () {
              utilService.toast('验证邮箱成功');
              $ionicHistory.goBack();
              data.email = data.emailToValidate
            });
          }
        });
      });
    };

    $scope.selectPic = function () {
      var originUrl = data.image_url;

      $cordovaCamera.getPicture({
        targetHeight: 1024,
        targetWidth: 1024,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.PNG,
        popoverOptions: new CameraPopoverOptions(32, 32, 128, 128, Camera.PopoverArrowDirection.ARROW_UP)

      }).then(function (imgUrl) {
        return $jrCrop.crop({
          url: imgUrl,
          width: 128,
          height: 128,
          title: '裁剪头像',
          cancelText: '取消',
          chooseText: '确定'
        });

      }).then(function (canvas) {
        utilService.toast('头像上传中');
        var image = canvas.toDataURL();
        return utilService.resizeImage(image, 128, 128);

      }).then(function (img) {
        data.image_url = img;
        return accountService.uploadImage(img);

      }).then(function (path) {
        data.image_url = path;
        return accountService.updateAvatar(path);

      }).then(function () {
        utilService.toast('头像上传成功');
        accountService.userInfo.image_url = data.image_url;

      }, function () {
        // fail
        utilService.toast('修改头像失败');
        data.image_url = originUrl;
      });
    };

    $scope.submit = function () {
      accountService.editProfile({
        name: data.name,
        description: data.description,
        sex: data.gender,
        birthday: data.birthday,
        school: data.school,
        email: data.email,
        qq: data.qq,
        wechat: data.wechat,
        receiveMail: data.mailOption == 0 ? 1 : 0,
        receiveImportantMail: data.mailOption <= 1 ? 1 : 0,
        receiveSMS: data.smsOption == 0 ? 1 : 0,
        receiveImportantSMS: data.smsOption <= 1 ? 1 : 0,
        preferred_categories: []
      }).then(function (rec) {
        angular.extend(accountService.userInfo, data);
        $ionicHistory.goBack();
        utilService.toast(rec.message);
        if (accountService.notify.fillInfoCount)
          accountService.refreshNotification();
      });
    };
    function processData() {
      console.log(data);
      data.school = data.school_name;
      if (data.receiveMail == 1) {
        data.mailOption = 0;
      } else if (data.receiveImportantMail == 1) {
        data.mailOption = 1;
      } else {
        data.mailOption = 2;
      }
      if (data.receiveSMS == 1) {
        data.smsOption = 0;
      } else if (data.receiveImportantSMS == 1) {
        data.smsOption = 1;
      } else {
        data.smsOption = 2;
      }
    }
  })

  .controller('EmailSecurityCodeController',
  function ($scope, $stateParams, $interval, $state, $ionicPopup, $ionicHistory, accountService) {

    var data = {
      email: $stateParams.email,
      countdown: 60,
      canResend: false,
      secCode: ''
    };

    var countdownTask;

    function startCountDown() {
      data.countdown = 60;
      data.canResend = false;
      countdownTask = $interval(function () {
        --data.countdown;
        if (data.countdown == 0) {
          $interval.cancel(countdownTask);
          data.canResend = true;
        }
      }, 1000);
    }

    startCountDown();

    $scope.data = data;

    $scope.resend = function () {
      if (!data.canResend) {
        return;
      }
      data.canResend = false;
      accountService.register(data.name, data.phone, data.password).then(startCountDown, startCountDown);
    };

    $scope.validate = function () {
      accountService.verifyPhone(data.phone, data.secCode).then(function () {

        accountService.login(data.phone, data.password).then(function (data) {
          $ionicPopup.alert({
            title: '注册成功',
            template: '<div style="text-align: center">' + '欢迎：' + data.name + '</div>'
          });
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $state.go('tab.mypage');

        }, function (data) {
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $state.go('tab.login');
        });
      })
    };

  });
