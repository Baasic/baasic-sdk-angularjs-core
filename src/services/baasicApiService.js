(function (angular, module, undefined) {
    "use strict";
    module.service("baasicApiService", ["baasicConstants",
        function (baasicConstants) {
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