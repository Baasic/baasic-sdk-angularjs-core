/* globals module, UriTemplate */

(function (angular, module, undefined) {
    'use strict';
    module.service('baasicUriTemplateService', [function () {
        return {
            parse: function (link) {
                return UriTemplate.parse(link);
            },
            constructTemplateUrl: function (config, params) {
                if (!config || !config.templateText || !config.defaultUrl) {
                    throw 'Invalid template configuration.';
                }
				
				var url,
					defaultUrl = config.defaultUrl;
                if (config.templateText) {
                    var sortParams = params.orderBy ? params.orderBy + '|' + params.orderDirection : null,
						expandConfig = { page: params.pageNumber, rpp: params.pageSize, sort: sortParams, searchQuery: params.search };

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

                    var expandedTemplate = config.templateText.expand(expandConfig);

                    var defaultUrlIndex = expandedTemplate.indexOf(defaultUrl);

                    url = expandedTemplate.substr(defaultUrlIndex);
                }
                else {
                    url = defaultUrl;
                }

                return url;
            }
        };
    }]);
})(angular, module);