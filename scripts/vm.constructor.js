(function (vm) {

    vm.Constructor = function (options) {

        this.selector = options.selector;
        this.initQueueCallback = options.initQueueCallback;

        this.welcomeBlock = document.querySelector(this.selector.welcomeBlock);

        this.welcomeLoadButton = document.querySelector(this.selector.welcomeLoadButton);
        this.welcomeLoadButton.onchange = this.loadRequests.bind(this);

        this.welcomeCreateButton = document.querySelector(this.selector.welcomeCreateButton);
        this.welcomeCreateButton.onclick = this.initRequests.bind(this);

        this.welcomeEditButton = document.querySelector(this.selector.welcomeEditButton);
        var storageRequestsJson = app.getFromLocalStorage(app.const.storageRequests);
        if (storageRequestsJson) {
            this.welcomeEditButton.show();
            this.welcomeEditButton.onclick = this.initRequests.bind(this, null, storageRequestsJson);
        }

        this.requestsForm = document.querySelector(this.selector.requestsForm);
        this.requestsSubmitButton = document.querySelector(this.selector.requestsSubmitButton);
        this.requestsSubmitButton.onclick = this.requestsSubmit.bind(this);
        this.requestsDownloadButton = document.querySelector(this.selector.requestsDownloadButton);
        this.requestsDownloadButton.onclick = this.requestsDownload.bind(this);

        this.groupAll = document.querySelector(this.selector.groupAll);
        this.groupAddButton = document.querySelector(this.selector.groupAddButton);
        this.groupAddButton.onclick = this.addGroup.bind(this);
        this.groupTemplate = document.querySelector(this.selector.groupTemplate);

        this.requestTemplate = document.querySelector(this.selector.requestTemplate);

        this.parameterTemplate = document.querySelector(this.selector.parameterTemplate);
    };

    vm.Constructor.prototype.loadRequests = function (event) {
        var self = this;

        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            var content = event.target.result;
            self.initRequests(null, content);
        };

        reader.readAsText(file);
    };

    vm.Constructor.prototype.initRequests = function (event, json) { // todo: try to remove event
        var data = json ? (typeof json === "string" ? JSON.parse(json) : json) : "";

        data ? data.forEach(function (group) { this.addGroup(null, group); }, this) : this.addGroup();

        this.welcomeBlock.hide();
        this.requestsForm.show();
    };

    vm.Constructor.prototype.addGroup = function (event, group) { // todo: try to remove event
        var groupElement = this.groupTemplate.cloneNode(true);

        if (group) {
            groupElement.querySelector(this.selector.groupMultiplicity).value = group.requests.length == 1
                ? app.const.single : app.const.group;
            groupElement.querySelector(this.selector.groupInterval).value = group.interval;

            group.requests.forEach(function (request) { this.addRequest(groupElement, null, request); }, this);
        } else {
            this.addRequest(groupElement);
        }

        var requestAddButton = groupElement.querySelector(this.selector.requestAddButton);
        requestAddButton.onclick = requestAddButton.onclick || this.addRequest.bind(this, groupElement);

        this.updateGroupByMultiplicity(groupElement);
        this.groupAll.appendChild(groupElement);
        groupElement.show();
    };

    vm.Constructor.prototype.addRequest = function (groupElement, event, request) { // todo: try to remove event
        var requestElement = this.requestTemplate.cloneNode(true);

        if (request) {
            requestElement.querySelector(this.selector.requestMethod).value = request.parameters
                ? app.const.post : app.const.get;
            requestElement.querySelector(this.selector.requestUrl).value = request.url;

            request.parameters ? request.parameters.forEach(function (parameter) {
                this.addParameter(requestElement, null, parameter);
            }, this) : "";
        } else {
            this.addParameter(requestElement);
        }

        this.updateRequestByMethod(requestElement, request);

        groupElement.querySelector(this.selector.requestAll).appendChild(requestElement);
        requestElement.show();
    };

    vm.Constructor.prototype.addParameter = function (requestElement, event, parameter) { // todo: try to remove event
        var parameterElement = this.parameterTemplate.cloneNode(true);

        if (parameter) {
            parameterElement.querySelector(this.selector.parameterName).value = parameter.name;
            parameterElement.querySelector(this.selector.parameterValue).value = parameter.value;
        }

        var parameterRemoveButton = parameterElement.querySelector(this.selector.parameterRemoveButton);
        parameterRemoveButton.onclick = parameterRemoveButton.onclick || this.removeElement.bind(this, parameterElement);

        requestElement.querySelector(this.selector.parameterAll).appendChild(parameterElement);
        parameterElement.show();
    };

    vm.Constructor.prototype.updateRequestByMethod = function (requestElem, request) {
        var methodElement = requestElem.querySelector(this.selector.requestMethod),
            parameterSection = requestElem.querySelector(this.selector.parameterAll),
            parameterAddButton = requestElem.querySelector(this.selector.parameterAddButton);

        if (methodElement.value === app.const.get) {
            parameterSection.hide();
            parameterAddButton.hide();
        } else {
            parameterSection.show();
            parameterAddButton.show();
        }

        methodElement.onchange = methodElement.onchange || this.updateRequestByMethod.bind(this, requestElem);
        parameterAddButton.onclick = parameterAddButton.onlick || this.addParameter.bind(this, requestElem);

        var requestRemoveButton = requestElem.querySelector(this.selector.requestRemoveButton);
        requestRemoveButton.onclick = requestRemoveButton.onclick || this.removeElement.bind(this, requestElem);
    };

    vm.Constructor.prototype.updateGroupByMultiplicity = function (groupElement) {
        var multiplicityElement = groupElement.querySelector(this.selector.groupMultiplicity),
            groupRemoveButton = groupElement.querySelector(this.selector.groupRemoveButton),
            requestAddButton = groupElement.querySelector(this.selector.requestAddButton),
            requestRemoveButton = groupElement.querySelector(this.selector.requestRemoveButton);

        if (multiplicityElement.value === app.const.single) {
            requestAddButton.hide();
            requestRemoveButton.hide();
        } else {
            requestAddButton.show();
            requestRemoveButton.show();
        }

        multiplicityElement.onchange = multiplicityElement.onchange || this.updateGroupByMultiplicity.bind(this, groupElement);
        groupRemoveButton.onclick = groupRemoveButton.onclick || this.removeElement.bind(this, groupElement);
    };

    vm.Constructor.prototype.removeElement = function (element) {
        element.parentElement && element.parentElement.children && element.parentElement.children.length > 1
            ? element.remove() : "";
    };

    vm.Constructor.prototype.requestsBuild = function () {
        var groupsElements = document.querySelectorAll(this.selector.groupTemplate);
        var groups = [];

        for (var i = 0; i < groupsElements.length - 1; i++) { // todo: try to remove excess element
            var intervalElement = groupsElements[i].querySelector(this.selector.groupInterval);
            var requestsElements = groupsElements[i].querySelectorAll(this.selector.requestTemplate);
            var requests = [];

            for (var j = 0; j < requestsElements.length; j++) {
                var methodElement = requestsElements[j].querySelector(this.selector.requestMethod);
                var urlElement = requestsElements[j].querySelector(this.selector.requestUrl);
                var parametersElements = requestsElements[j].querySelectorAll(this.selector.parameterTemplate);
                var parameters = [];

                for (var k = 0; k < parametersElements.length; k++) {
                    var nameElement = parametersElements[k].querySelector(this.selector.parameterName);
                    var valueElement = parametersElements[k].querySelector(this.selector.parameterValue);

                    var parameter = {
                        name: nameElement.value,
                        value: valueElement.value
                    };

                    parameters.push(parameter);
                }

                var request = {
                    url: urlElement.value,
                }

                methodElement.value === app.const.get ? "" : request.parameters = parameters;

                requests.push(request);
            }

            var group = {
                interval: intervalElement.value,
                requests: requests
            }

            groups.push(group);
        }

        return groups;
    };

    vm.Constructor.prototype.requestsDownload = function () {
        var groups = this.requestsBuild();

        var blob = new Blob([JSON.stringify(groups)], { type: "text/plain;charset=UTF-8" });

        var now = new Date();
        var fileName = app.const.filePrefix + app.const.fileDelimiter + now.toLocaleTimeString()
            + app.const.fileDelimiter + now.toLocaleDateString() + app.const.fileExtension;

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    vm.Constructor.prototype.requestsSubmit = function () {
        var groups = this.requestsBuild();

        app.setToLocalStorage(app.const.storageRequests, groups);

        this.requestsForm.hide();

        this.initQueueCallback(groups);
    };

})(window.app.vm);