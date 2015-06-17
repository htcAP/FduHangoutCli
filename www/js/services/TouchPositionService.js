FduHangoutApp.service('touchPositionService', function () {
  var data = this.data = {
    x: 0,
    y: 0
  };

  this.update = function (e) {
    data.x = e.pageX || data.x;
    data.y = e.pageY || data.y;
  };

  document.addEventListener('touchstart', this.update);
  document.addEventListener('touchend', this.update);
  document.addEventListener('touchmove', this.update);
});