/* globals module */
/**
 * @module baasicLookupRouteService
 * @description Baasic Lookup Route Service provides Baasic route templates which can then be expanded to Baasic REST URI's through the [URI Template](https://github.com/Baasic/uritemplate-js) by providing it with an object that contains URI parameters. `baasicLookupService` uses `baasicLookupRouteService` to obtain a part of needed routes while the other part is obtained through HAL. Route services by convention use the same function names as their corresponding services.
 * @copyright (c) 2015 Mono-Software
 * @license MIT
 * @author Mono-Software
*/

(function (angular, module, undefined) {
    'use strict';
    module.service('baasicLookupRouteService', ['baasicUriTemplateService',
        function (uriTemplateService) {
            return {			
                /**
                * Parses get route which can be expanded with additional options. Supported items are: 
				* - `embed` - Comma separated list of resources to be contained within the current representation.
                * @method        
                * @example baasicLookupRouteService.get.expand({});               
                **/ 			
                get: uriTemplateService.parse('lookups/{?embed,fields}'),
                /**
                * Parses and expands URI templates based on [RFC6570](http://tools.ietf.org/html/rfc6570) specifications. For more information please visit the project [github](https://github.com/Baasic/uritemplate-js) page.
                * @method
                * @example baasicLookupRouteService.parse("route/{?embed,fields,options}").expand({embed: "embeddedResource"});
                **/  					
				parse: uriTemplateService.parse
            };
        }]);
}(angular, module));