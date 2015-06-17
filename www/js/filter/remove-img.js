FduHangoutApp.filter('removeImg', function () {
  return function (html) {
    var ret = html.replace(/<img src=\".+?\".+?>/img, '');
    console.log(ret);
    return ret;
  }
});