(function () {

    app = {};

    app.vm = {};

    app.const = {
        get: "get",
        post: "post",
        single: "single",
        group: "group",
        storageRequests: "requests",
        fileDelimiter: "_",
        filePrefix: "ibb",
        fileExtension: ".txt",
        executionInterval: 3 * 1000
    };

    app.getCookie = function (name) {
        var parts = document.cookie.split(name + "=");
        return parts.length == 2 ? parts.pop().split(";").shift() : "";
    };

    app.setCookie = function (name, value) {
        var date = new Date();
        date.setYear(9999);

        document.cookie = name + "=" + value + ";expires=" + date;
    };

    app.getFromLocalStorage = function (key) {
        var value = localStorage.getItem(key);
        return JSON.parse(value);
    };

    app.setToLocalStorage = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    Element.prototype.hide = function () {
        this.classList.add("g-hidden");
    };

    Element.prototype.show = function () {
        this.classList.remove("g-hidden");
    };
    
    Element.prototype.displayToggle = function () {
        this.classList.contains("g-hidden")
            ? this.show()
            : this.hide();
    };

    String.prototype.latinLetters = function () {
        return this.replace(/[^A-Za-z]/gi, "");
    };

})();