/* globals module */
/**
 * @module baasicLookupRouteService
**/

/** 
 * @overview Lookup route service.
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
                * Parses get article rating route which can be expanded with additional options. Supported items are: 
				* - `embed` - Comma separated list of resources to be contained within the current representation.
                * @method        
                * @example baasicLoginRouteService.get.expand({});               
                **/ 			
                get: uriTemplateService.parse('lookups/{?embed,fields}'),
                /**
                * Parses and expands URI templates based on [RFC6570](http://tools.ietf.org/html/rfc6570) specifications. For more information please visit the project [github](https://github.com/Baasic/uritemplate-js) page.
                * @method
                * @example uriTemplateService.parse("route/{?embed,fields,options}").expand({embed: "embeddedResource"});
                **/  					
				parse: uriTemplateService.parse
            };
        }]);
}(angular, module));