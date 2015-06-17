leyiPlugin.service('testPlugin', function (pluginService) {

  this.test = function (arg) {
    return pluginService.invoke('test', 'hello', arg);
  }
});