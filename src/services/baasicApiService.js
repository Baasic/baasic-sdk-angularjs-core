﻿/* globals module */
/**
 * @module baasicApiService
**/

/** 
 * @overview Api Service.
 * @copyright (c) 2015 Mono-Software
 * @license MIT
 * @author Mono-Software
*/

(function (angular, module, undefined) {
    'use strict';
    module.service('baasicApiService', ['baasicConstants',
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
                /**
                * Parses Baasic Api pagination, sorting and search parameters.
                * @method        
                * @example baasicApiService.findParams({pageNumber:1, pageSize:100});               
                **/ 				
                findParams: function (options) {
                    return new FindParams(options);
                },
                /**
                * Parses specified key parameters; initial object can be expanded with additional parameters.
                * @method        
                * @example baasicApiService.getParams(("value", {additionalOptions: "option"}, "propertyName"));               
                **/ 				
                getParams: function (id, options, propName) {
                    return new KeyParams(id, options, propName);
                },	
                /**
                * Transforms an object so that it can be safely expanded with additional properties.
                * @method        
                * @example baasicApiService.createParams(object);               
                **/ 					
                createParams: function (data) {
                    return new ModelParams(data);
                },						
                /**
                * Transforms an object so that it can be safely expanded with additional properties.
                * @method        
                * @example baasicApiService.updateParams(object);               
                **/ 									
                updateParams: function (data) {
                    return new ModelParams(data);
                },				
                /**
                * Transforms an object so that it can be safely expanded with additional properties.
                * @method        
                * @example baasicApiService.removeParams(object);               
                **/ 									
                removeParams: function (data) {
                    return new ModelParams(data);
                }
            };
        }]);
}(angular, module));