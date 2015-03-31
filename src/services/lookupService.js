/* globals module */
/**
 * @module baasicLookupService
 * @description Baasic Lookup Service provides an easy way to consume Baasic Lookup REST API.
 * @copyright (c) 2015 Mono
 * @license MIT
 * @author Mono
*/
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
                 /**
                 * Returns a promise that is resolved once the get action has been performed. Success response returns the lookup resources.
                 * @method        
                 * @example 
baasicLookupService.get()
.success(function (data) {
  // perform success action here
})
.error(function (response, status, headers, config) {
  // perform error handling here
});
                 **/  					
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