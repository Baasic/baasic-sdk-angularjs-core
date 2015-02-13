/* globals module */

(function (angular, module, undefined) {
    'use strict';
    module.service('baasicLookupService', ['baasicApiHttp', 'baasicApp', 'baasicApiService', 'baasicLookupRouteService',
        function (baasicApiHttp, baasicApp, baasicApiService, lookupRouteService) {			
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
					baasicApiHttp.get(lookupRouteService.get.expand(baasicApiService.getParams({
						embed: 'role,accessAction,accessSection'
					})))
						.success(function (data, status, headers, config) {							
							var responseData = getResponseData(options, data);								
							deferred.resolve({
								data: responseData,
								status: status,
								headers: headers,
								config: config
							});
						})
						.error(function (data, status, headers, config) {
							deferred.reject({
								data: data,
								status: status,
								headers: headers,
								config: config
							});
						});
                    return deferred.promise;
                }
            };
        }]);
}(angular, module));