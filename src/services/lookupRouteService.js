/* globals module */

(function (angular, module, undefined) {
    'use strict';
    module.service('baasicLookupRouteService', ['baasicUriTemplateService',
        function (uriTemplateService) {
            return {				
                get: uriTemplateService.parse('lookups/{?embed,fields}'),
				parse: uriTemplateService.parse
            };
        }]);
}(angular, module));