/* globals module, MonoSoftware */
/**
 * @module baasicApp
**/

/** 
 * @overview App service.
 * @copyright (c) 2015 Mono-Software
 * @license MIT
 * @author Mono-Software
*/

(function (angular, module, undefined) {
	'use strict';
	module.provider('baasicApp', function baasicAppService() {
		var apps = {};
		var defaultApp;
		this.create = function create(apiKey, config) {
			var defaultConfig = {
				apiRootUrl: 'api.baasic.local',
				apiVersion: 'beta'
			};
			var app = MonoSoftware.Baasic.Application.init(apiKey, angular.extend(defaultConfig, config));

			apps[apiKey] = app;
			if (!defaultApp) {
				defaultApp = app;
			}

			return app;
		};

		this.$get = function () {
			return {
                /**
                * Returns a list of app applications.
                * @method        
                * @example baasicLoginRouteService.all();               
                **/ 				
				all: function () {
					var list = [];
					for (var key in apps) {
						list.push(apps[key]);
					}
					
					return list;
				},
                /**
                * Returns a specified application reference.
                * @method        
                * @example baasicLoginRouteService.get("apiKey");               
                **/ 				
				get: function getBaasicApplication (apiKey) {
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