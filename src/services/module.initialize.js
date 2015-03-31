/* globals module */
/**
 * @module baasicConstants
 * @description Baasic constants contain values such as _id_ property name and _model_ property name parameters that can be used in case manual model or option transformation is needed.
 * @copyright (c) 2015 Mono
 * @license MIT
 * @author Mono
*/
(function (angular, module, undefined) {
    'use strict';
    module.constant('baasicConstants', {
        idPropertyName: 'id',
        modelPropertyName: 'model'
    });
}(angular, module));