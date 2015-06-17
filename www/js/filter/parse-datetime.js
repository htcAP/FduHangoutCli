FduHangoutApp.filter('parseDatetime', function () {
  return function (date) {
    date = new Date(date);

    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var now = new Date();

    var delta = (now - date) / 1000 / 60;

    if (delta <= 5) {
      return '刚刚';
    }
    if (delta < 60) {
      return Math.floor(delta) + '分钟前'
    }

    if (m < 10) {
      m = '0' + m;
    }

    if (y != now.getFullYear()) {
      return y + '年' + M + '月' + d + '日 ' + h + ':' + m;
    }
    if (M != now.getMonth() + 1 || d != now.getDate()) {
      return M + '月' + d + '日 ' + h + ':' + m;
    }
    return '今天 ' + h + ':' + m;
  }
});