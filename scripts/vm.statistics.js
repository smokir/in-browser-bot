(function (vm) {

    vm.Statistics = function (options) {
        this.selector = options.selector;
        this.requests = [];

        this.statisticsBlock = document.querySelector(this.selector.statisticsBlock);

        this.statisticsToggleButton = document.querySelector(this.selector.statisticsToggleButton);
        this.statisticsToggleButton.onclick = this.statisticsBlock.displayToggle.bind(this.statisticsBlock);

        this.statTemplate = document.querySelector(this.selector.statTemplate);
    };

    vm.Statistics.prototype.initStatistics = function () {
        this.statisticsToggleButton.show();
    };

    vm.Statistics.prototype.updateStatistics = function (url, interval) { // todo: think about not passing interval every time
        var nextExecution = this.addIntervalToNow(interval);

        var updated = this.requests.some(function (request) {
            if (request.url === url) {
                request.nextExecution = nextExecution;
                return true;
            }
            return false;
        }, this);

        updated ? "" : this.requests.push({ url: url, nextExecution: nextExecution });

        this.showStats();
    };

    vm.Statistics.prototype.addIntervalToNow = function (interval) {
        var now = new Date();
        now.setMilliseconds(now.getMilliseconds() + interval);
        return now.toLocaleDateString() + " " + now.toLocaleTimeString();
    };

    vm.Statistics.prototype.showStats = function () {
        while (this.statisticsBlock.firstChild) {
            this.statisticsBlock.removeChild(this.statisticsBlock.firstChild);
        }

        var sortByNextExecutionDesc = function (a, b) {
            a.nextExecution > b.nextExectuion ? -1 : a.nextExecution < b.nextExectuion ? 1 : 0;
        };

        this.requests.sort(sortByNextExecutionDesc).forEach(function (request) { // todo: fix 1-digit hour
            var statElement = this.statTemplate.cloneNode(true);

            statElement.querySelector(this.selector.statUrl).textContent = request.url;
            statElement.querySelector(this.selector.statTime).textContent = request.nextExecution;

            this.statisticsBlock.appendChild(statElement);
            statElement.show();
        }, this);

    };

})(window.app.vm);