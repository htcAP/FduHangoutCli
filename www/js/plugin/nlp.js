leyiPlugin.service('nlpPlugin', function (pluginService) {

    this.nlp_get_time = function (arg) {
        return pluginService.invoke('nlp_get_time', arg);
    }
});