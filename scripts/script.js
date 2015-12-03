(function () {

    var statistics = new app.vm.Statistics({
        selector: {
            statisticsBlock: "[id=js-statistics]",
            statisticsToggleButton: "[id=js-statistics-toggle]",
            statTemplate: "[class~=js-stat]",
            statUrl: "[name=url]",
            statTime: "[name=time]",
        }
    });

    var queue = new app.vm.Queue({
        selector: {
            mainIframe: "[id=js-iframe]"
        },
        initStatisticsCallback: statistics.initStatistics.bind(statistics),
        updateStatisticsCallback: statistics.updateStatistics.bind(statistics)
    });

    var constructor = new app.vm.Constructor({
        selector: {
            welcomeBlock: "[id=js-welcome]",
            welcomeLoadButton: "[id=js-welcome-load]",
            welcomeCreateButton: "[id=js-welcome-create]",
            welcomeEditButton: "[id=js-welcome-edit]",

            requestsForm: "[id=js-requests]",
            requestsSubmitButton: "[id=js-requests-submit]",
            requestsDownloadButton: "[id=js-requests-download]",

            groupAll: "[id=js-group-all]",
            groupAddButton: "[id=js-group-add]",
            groupTemplate: "[class~=js-group]",
            groupMultiplicity: "[name=multiplicity]",
            groupInterval: "[name=interval]",
            groupRemoveButton: "[class~=js-group-remove]",

            requestAll: "[class~=js-request-all]",
            requestAddButton: "[class~=js-request-add]",
            requestTemplate: "[class~=js-request]",
            requestMethod: "[name=method]",
            requestUrl: "[name=url]",
            requestRemoveButton: "[class~=js-request-remove]",

            parameterAll: "[class~=js-parameter-all]",
            parameterAddButton: "[class~=js-parameter-add]",
            parameterTemplate: "[class~=js-parameter]",
            parameterName: "[name=name]",
            parameterValue: "[name=value]",
            parameterRemoveButton: "[class~=js-parameter-remove]",
        },
        initQueueCallback: queue.initQueue.bind(queue)
    });

})();