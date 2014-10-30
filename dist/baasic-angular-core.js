(function (angular, undefined) {
    var module = angular.module("baasic.api", ["HALParser"]);

    module.config(["$provide", function config($provide) {
        // copied from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript

        function regExpEscape(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };

        if (!('withCredentials' in new XMLHttpRequest()) || (window.ActiveXObject || "ActiveXObject" in window)) {

            $provide.decorator("$httpBackend", ["$delegate", "$q", "$rootScope", "$window", "$document", "baasicApp", function initBaasicProxy($delegate, $q, $rootScope, $window, $document, baasicApp) {
                var apps = baasicApp.all();
                var proxies = [];
                var requestHash = {};
                var nextRequestId = 0;

                function sendNewMessage(proxy, message, callback) {

                    message.requestId = nextRequestId;

                    var request = {
                        proxy: proxy,
                        callback: callback,
                        message: message
                    };

                    requestHash[message.requestId] = request;

                    proxy.sendMessage(request);

                    nextRequestId += 1;
                }

                for (var i = 0, l = apps.length; i < l; i++) {
                    var app = apps[i];

                    (function (app) {
                        var apiUrl = app.get_apiUrl();
                        var proxy = {
                            proxyFrame: [],
                            apiUrlRegex: new RegExp("^" + regExpEscape(apiUrl)),
                            sendMessage: function sendMessageToQueue(request) {
                                this.proxyFrame.push[request];
                            }
                        };

                        proxies.push(proxy);

                        var injectFrame = angular.element('<iframe src="' + apiUrl + 'proxy/angular" style="display:none"></iframe>');
                        injectFrame.bind("load", function () {
                            var queue = proxy.proxyFrame;

                            proxy.proxyFrame = this;
                            proxy.sendMessage = function sendMessageToProxy(request) {
                                this.proxyFrame.contentWindow.postMessage(JSON.stringify(request.message), apiUrl);
                            };

                            while (queue.length > 0) {
                                proxy.sendMessage(queue.shift());
                            }
                        });

                        $document.find("body").append(injectFrame);
                    })(app);
                }

                angular.element($window).bind("message", function readMessageFromProxy(e) {
                    var event = e.originalEvent || e;
                    var response = JSON.parse(event.data);
                    var request = requestHash[response.requestId];
                    if (request && event.source == request.proxy.proxyFrame.contentWindow) {
                        delete requestHash[response.requestId];
                        request.callback(response.status, response.response, response.headersString);
                    }
                });

                return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
                    for (var i = 0, l = proxies.length; i < l; i++) {
                        var proxy = proxies[i];
                        if (proxy.apiUrlRegex.test(url)) {

                            sendNewMessage(proxy, {
                                method: method,
                                url: url,
                                post: post,
                                headers: headers,
                                timeout: timeout,
                                withCredentials: withCredentials,
                                responseType: responseType
                            }, callback);

                            return;
                        }
                    }

                    $delegate(method, url, post, callback, headers, timeout, withCredentials, responseType);
                };
            }]);
        }
    }]);

    (function (angular, module, undefined) {
        "use strict";
        var extend = angular.extend;
        // Tokenizer and unquote code taken from http://stackoverflow.com/questions/5288150/digest-authentication-w-jquery-is-it-possible/5288679#5288679
        var wwwAuthenticateTokenizer = (function () {
            var ws = '(?:(?:\\r\\n)?[ \\t])+',
                token = '(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2E\\x30-\\x39\\x3F\\x41-\\x5A\\x5E-\\x7A\\x7C\\x7E]+)',
                quotedString = '"(?:[\\x00-\\x0B\\x0D-\\x21\\x23-\\x5B\\\\x5D-\\x7F]|' + ws + '|\\\\[\\x00-\\x7F])*"';

            return RegExp(token + '(?:=(?:' + quotedString + '|' + token + '))?', 'g');
        })();

        function unquote(quotedString) {
            return quotedString.substr(1, quotedString.length - 2).replace(/(?:(?:\r\n)?[ \t])+/g, " ");
        }

        function parseWWWAuthenticateHeader(value) {
            if (value) {
                var tokens = value.match(wwwAuthenticateTokenizer);
                if (tokens && tokens.length > 0) {
                    var wwwAutheniticate = {
                        scheme: tokens[0]
                    };

                    if (tokens.length > 1) {
                        var details = {};
                        for (var i = 1, l = tokens.length; i < l; i++) {
                            var values = tokens[i].split("=");
                            details[values[0]] = unquote(values[1]);
                        }

                        wwwAutheniticate.details = details;
                    }

                    return wwwAutheniticate;
                }
            }

            return undefined;
        }

        function startsWith(target, input) {
            return target.substring(0, input.length) === input;
        }

        function isAbsoluteUrl(url) {
            var lowerUrl = url.toLowerCase();
            return startsWith(lowerUrl, "http://") || startsWith(lowerUrl, "https://");
        }

        function tail(array) {
            return Array.prototype.slice.call(array, 1);
        }

        function createShortMethods(proxy) {
            angular.forEach(tail(arguments, 1), function (name) {
                proxy[name] = function (url, config) {
                    return proxy(extend(config || {}, {
                        method: name,
                        url: url
                    }));
                };
            });
        }

        function createShortMethodsWithData(proxy) {
            angular.forEach(tail(arguments, 1), function (name) {
                proxy[name] = function (url, data, config) {
                    return proxy(extend(config || {}, {
                        method: name,
                        url: url,
                        data: data
                    }));
                };
            });
        }

        var proxyFactory = function proxyFactory($rootScope, $http, parser, app) {
            var apiUrl = app.get_apiUrl();

            function parseHeaders(headers) {
                var wwwAuthenticate = parseWWWAuthenticateHeader(headers("WWW-Authenticate"));
                if (wwwAuthenticate) {
                    if (wwwAuthenticate.scheme.toLowerCase() === "bearer") {
                        var details = wwwAuthenticate.details;
                        if (details) {
                            if (details.error) {
                                switch (details.error) {
                                case "invalid_token":
                                    var token = app.get_accessToken();
                                    app.update_accessToken(null);
                                    $rootScope.$broadcast("token_error", {
                                        token: token,
                                        error: details.error,
                                        error_description: details.error_description
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            var proxyMethod = function (config) {
                if (config) {
                    config.withCredentials = true;
                    if (!isAbsoluteUrl(config.url)) {
                        config.url = apiUrl + config.url;
                    }

                    var headers = config.headers || (config.headers = {});

                    if (!headers["Content-Type"]) {
                        headers["Content-Type"] = "application/json; charset=UTF-8";
                    }
                    if (!headers["Accept"]) {
                        headers["Accept"] = "application/hal+json; charset=UTF-8";
                    }

                    var token = app.get_accessToken();
                    if (token) {
                        headers["AUTHORIZATION"] = token.token_type + ' ' + token.access_token;
                    }
                }

                var promise = $http(config);

                promise = extend(promise.then(function (response) {
                    if (response.headers) {
                        var contentType = response.headers("Content-Type");
                        if (contentType && contentType.toLowerCase().indexOf("application/hal+json") !== -1) {
                            response.data = parser.parse(response.data);
                        }

                        parseHeaders(response.headers);
                    }
                }, function (response) {
                    if (response.headers) {
                        parseHeaders(response.headers);
                    }
                }).
                finally(function () {
                    var token = app.get_accessToken();
                    if (token && token.sliding_window) {
                        token.expireTime = new Date().getTime() + (token.sliding_window * 1000);
                        app.update_accessToken(token);
                    }
                }), promise);

                return promise;
            }

            createShortMethods(proxyMethod, "get", "delete", "head", "jsonp");
            createShortMethodsWithData(proxyMethod, "post", "put");

            return proxyMethod;
        }

        module.service("baasicApiHttp", ["$rootScope", "$http", "HALParser", "baasicApp", function baasicApiHttp($rootScope, $http, HALParser, baasicApp) {
            var parser = new HALParser();

            var proxy = proxyFactory($rootScope, $http, parser, baasicApp.get());

            proxy.createNew = function (app) {
                return proxyFactory($rootScope, $http, parser, app);
            };

            return proxy;
        }]);
    })(angular, module);

    (function (angular, module, undefined) {
        "use strict";
        module.service("baasicApiService", ["baasicConstants", function (baasicConstants) {
            function FindParams(options) {
                if (angular.isObject(options)) {
                    angular.extend(this, options);
                    if (options.hasOwnProperty('orderBy') && options.hasOwnProperty('orderDirection')) {
                        this.sort = options.orderBy ? options.orderBy + '|' + options.orderDirection : null;
                    }
                    if (options.hasOwnProperty('search')) {
                        this.searchQuery = options.search;
                    }
                    if (options.hasOwnProperty('pageNumber')) {
                        this.page = options.pageNumber;
                    }
                    if (options.hasOwnProperty('pageSize')) {
                        this.rpp = options.pageSize;
                    }
                } else {
                    this.searchQuery = options;
                }
            }

            function KeyParams(id, options, propName) {
                if (angular.isObject(id)) {
                    angular.extend(this, id);
                } else {
                    if (propName !== undefined) {
                        this[propName] = id;
                    } else {
                        this[baasicConstants.idPropertyName] = id;
                    }
                }

                if (options !== undefined && angular.isObject(options)) {
                    angular.extend(this, options);
                }
            }

            function ModelParams(data) {
                if (data.hasOwnProperty(baasicConstants.modelPropertyName)) {
                    angular.extend(this, data);
                } else {
                    this[baasicConstants.modelPropertyName] = data;
                }
            }

            return {
                findParams: function (options) {
                    return new FindParams(options);
                },
                getParams: function (id, options, propName) {
                    return new KeyParams(id, options, propName);
                },
                createParams: function (data) {
                    return new ModelParams(data);
                },
                updateParams: function (data) {
                    return new ModelParams(data);
                },
                removeParams: function (data) {
                    return new ModelParams(data);
                }
            };
        }]);
    }(angular, module));
    (function (angular, module, undefined) {
        "use strict";
        module.provider("baasicApp", function baasicAppService() {
            var apps = {};
            var defaultApp;
            this.create = function create(apiKey, config) {
                var defaultConfig = {
                    apiRootUrl: "api.baasic.com",
                    apiVersion: "beta"
                };
                var app = MonoSoftware.Baasic.Application.init(apiKey, angular.extend(defaultConfig, config));

                apps[apiKey] = app;
                if (!defaultApp) {
                    defaultApp = app;
                }

                return app;
            }

            this.$get = function () {
                return {
                    all: function () {
                        var list = [];
                        for (var key in apps) {
                            list.push(apps[key]);
                        }

                        return list;
                    },
                    get: function getBaasicApplication(apiKey) {
                        if (apiKey) {
                            return apps[apiKey];
                        } else {
                            return defaultApp;
                        }
                    }
                };
            };
        });
    }(angular, module));
    (function (angular, module, undefined) {
        "use strict";
        module.service("baasicLookupRouteService", ["baasicUriTemplateService", function (uriTemplateService) {
            return {
                get: uriTemplateService.parse("lookups/{?embed,fields}"),
                parse: uriTemplateService.parse
            };
        }]);
    }(angular, module));
    (function (angular, module, undefined) {
        "use strict";
        module.service("baasicLookupService", ["baasicApiHttp", "baasicApp", "baasicApiService", "baasicLookupRouteService", function (baasicApiHttp, baasicApp, baasicApiService, lookupRouteService) {
            var apiKey = baasicApp.get().get_apiKey(),
                lookupKey = "baasic-lookup-data-" + apiKey;

            function getResponseData(params, data) {
                var responseData = {};
                if (params.embed) {
                    var embeds = params.embed.split(',');
                    for (var index in embeds) {
                        var propName = embeds[index];
                        if (data.hasOwnProperty(propName)) {
                            responseData[propName] = data[propName];
                        }
                    }
                }
                return responseData;
            }

            return {
                routeService: lookupRouteService,
                get: function (options) {
                    var deferred = baasicApiHttp.createHttpDefer();
                    var result = JSON.parse(localStorage.getItem(lookupKey));
                    if (result === undefined || result === null) {
                        baasicApiHttp.get(lookupRouteService.get.expand(baasicApiService.getParams({
                            embed: 'role,accessAction,accessSection'
                        }))).success(function (data, status, headers, config) {
                            localStorage.setItem(lookupKey, JSON.stringify(data));
                            var responseData = getResponseData(options, data);
                            deferred.resolve({
                                data: responseData,
                                status: status,
                                headers: headers,
                                config: config
                            });
                        }).error(function (data, status, headers, config) {
                            deferred.reject({
                                data: data,
                                status: status,
                                headers: headers,
                                config: config
                            });
                        });
                    } else {
                        deferred.resolve({
                            data: getResponseData(options, result)
                        });
                    }
                    return deferred.promise;
                },
                reset: function () {
                    localStorage.setItem(lookupKey, null);
                }
            };
        }]);
    }(angular, module));
    (function (angular, module, undefined) {
        "use strict";
        module.constant("baasicConstants", {
            idPropertyName: 'id',
            modelPropertyName: 'model'
        });
    }(angular, module));
    (function (angular, module, undefined) {
        "use strict";
        module.service("baasicUriTemplateService", [function () {
            return {
                parse: function (link) {
                    return UriTemplate.parse(link);
                },
                constructTemplateUrl: function (config, params) {
                    if (!config || !config.templateText || !config.defaultUrl) {
                        throw "Invalid template configuration.";
                    }

                    if (config.templateText) {
                        var
                        expandedTemplate = null,
                            defaultUrlIndex = null,
                            sortParams = params.orderBy ? params.orderBy + '|' + params.orderDirection : null;

                        var expandConfig = {
                            page: params.pageNumber,
                            rpp: params.pageSize,
                            sort: sortParams,
                            searchQuery: params.search
                        };

                        if (config.additionalParams) {
                            for (var p in config.additionalParams) {
                                if (expandConfig[p]) {
                                    throw 'Property' + p + ' already exists in default expand configuration';
                                }
                                else {
                                    expandConfig[p] = config.additionalParams[p];
                                }
                            }
                        }

                        expandedTemplate = config.templateText.expand(expandConfig);

                        defaultUrlIndex = expandedTemplate.indexOf(config.defaultUrl);

                        url = expandedTemplate.substr(defaultUrlIndex);
                    }
                    else {
                        url = defaultUrl;
                    }

                    return url;
                }
            }
        }]);
    })(angular, module);
})(angular);