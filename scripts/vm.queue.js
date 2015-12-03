(function (vm) {

    vm.Queue = function (options) {
        this.selector = options.selector;
        this.initStatisticsCallback = options.initStatisticsCallback;
        this.updateStatisticsCallback = options.updateStatisticsCallback;
        this.queue = [];

        this.mainIframe = document.querySelector(this.selector.mainIframe);
        this.formTarget = this.mainIframe.name;
    };

    vm.Queue.prototype.initQueue = function (groups) {
        groups.forEach(function (group) {
            var interval = this.getMsInterval(group.interval);

            this.addToQueue(group.requests, interval);

            setInterval(this.addToQueue.bind(this, group.requests, interval), interval);
        }, this);

        this.mainIframe.show();

        this.initStatisticsCallback();

        setInterval(this.executeFromQueue.bind(this), app.const.executionInterval);
    };

    vm.Queue.prototype.getMsInterval = function (interval) {
        var s = "*1000+";
        var m = "*60s+";
        var h = "*60m+";

        var expression = interval.replace(/h/g, h).replace(/m/g, m).replace(/s/g, s).replace(/\s/g, "").replace(/\s/g); // ???

        var result = expression.split("+").reduce(function (sum, multiplicationGroup) {
            var composition = multiplicationGroup.split("*").reduce(function (multiplication, stringNumber) {
                var number = parseInt(stringNumber);
                return number ? multiplication *= number : 0;
            }, 1);

            return sum + composition;
        }, 0);

        return result;
    };

    vm.Queue.prototype.addToQueue = function (requests, interval) {
        requests.forEach(function (request) {
            var func = request.parameters
                ? this.simplePost.bind(this, request.url, request.parameters, interval)
                : this.simpleGet.bind(this, request.url, interval);

            this.queue.push(func);
        }, this);
    };

    vm.Queue.prototype.simpleGet = function (url, interval) {
        var newSrc = url;
        this.mainIframe.src = newSrc;
        this.updateStatisticsCallback(url, interval);
    };

    vm.Queue.prototype.simplePost = function (url, parameters, interval) {
        var requestLetters = url.latinLetters();
        var formElement = document.querySelector("[name=" + requestLetters + "]");

        if (!formElement) {
            formElement = document.createElement("form");
            formElement.hide();
            formElement.method = "post";
            formElement.target = this.formTarget;
            formElement.action = url;
            formElement.name = requestLetters;

            parameters.forEach(function (parameter) {
                var parameterElement = document.createElement("input");
                parameterElement.name = parameter.name;
                parameterElement.value = parameter.value;
                formElement.appendChild(parameterElement);
            }, this);

            document.body.appendChild(formElement);
        }

        formElement.submit();
        this.updateStatisticsCallback(url, interval);
    };

    vm.Queue.prototype.executeFromQueue = function () {
        var func = this.queue.shift();
        func ? func() : "";
    };

})(window.app.vm);