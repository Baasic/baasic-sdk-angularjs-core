(function (angular, module, undefined) {
    "use strict";
    module.service("baasicLookupService", ["baasicApiHttp", "baasicApp", "baasicApiService", "baasicLookupRouteService",
        function (baasicApiHttp, baasicApp, baasicApiService, lookupRouteService) {
			var apiKey = baasicApp.get().get_apiKey(), lookupKey = "baasic-lookup-data-" + apiKey;

			function getResponseData(params, data) {
				var responseData = {};
				if (params.embed) {
					var embeds = params.embed.split(',');
					for (var embed in embeds) {  
						if (data.hasOwnProperty(embed)) {  
							responseData[embed] = data[embed];
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
						})))
                            .success(function (data, status, headers, config) {
                                localStorage.setItem(lookupKey, JSON.stringify(data));								
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