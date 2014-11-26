# Baasic AngularJS Core Client Library

Baasic AngularJS Core library provides integration access to Baasic Service [REST API](https://api.baasic.com). The library will provide ...

## Dependencies

Baasic AngularJS Core library has the following dependencies:

* [AngularJS](http://www.angularjs.org/) (>= 1.2.16)
* [HAL Parser](https://github.com/jasonaden/angular-hal)
* [URI Template](https://github.com/fxa/uritemplate-js)

## Usage

This section will describe how to add the Baasic AngularJS Core library to your project. If you prefer learning by example please skip to [Demo Section](#demo).

### Adding the library to your project

Please add the following lines of code after the AngularJS include:

```html
<script src='//cdn.net/js/hal-parser.js'></script>
<script src='//cdn.net/js/uritemplate-min.js'></script>
<script src='//cdn.net/js/baasic-angular-1.0.0.min.js'></script>
```

The recommended way of serving the library is through a [CDN]((http://en.wikipedia.org/wiki/Content_delivery_network) but note that this is not a requirement. If you prefer adding the library files directly to your project instead, please modify the includes accordingly.

### Initialization

To be able use the library you will need to add the Baasic (_baasic.baasicApi_) dependency to your AngularJS module. This will allow you to use the library services described in [Modules Section](#baasic-modules).

```js
angular.module('my-module', ["baasic.baasicApi"])
```

### Application Configuration

Baasic AngularJS library allows you to use multiple Baasic applications in your AngularJS modules. To initialize a Baasic application you will need to add the following code to you module configuration:

```js
module.config(["baasicAppProvider",
    function (baasicAppProvider) {
        var app = baasicAppProvider.create("my-app-identifier", {
            apiRootUrl: "api.baasic.com",
            apiVersion: "v1"
        });
    }]);
```

**Note:** _To obtain a Baasic Application Identifier please create your application on [Baasic Registration](https://dashboard.baasic.com/register/) page._

## Baasic Modules

Baasic back-end contains various built-in modules that can be easily consumed through the Baasic AngularJS library. Below you can find detailed information about all the core modules supported by the library.

### Baasic Module Architecture

To get a better understanding of Baasic AngularJS services bellow are the details of the main architecture to which all the library services conform to.

* Core Services
    * __baasicApp__ service is used to manage Baasic application instances. Multiple AngularJS application instances can be created and coexist at the same time (each will communicate with its corresponding Baasic application)
        *  create an application
        ```js
        module.controller("MyCtrl", ["baasicApp",
            function MyCtrl(baasicApp) {
                var app = baasicApp.create("my-app-identifier", {
                    apiRootUrl: "api.baasic.com",
                    apiVersion: "production"
                });
            }]);
        ```
        * get the default application
        ```js
        module.controller("MyCtrl", ["baasicApp",
            function MyCtrl(baasicApp) {
                var app = baasicApp.get();
            }]);
        ```
        * application object has the following methods
        ```js
        var apiKey = app.get_apiKey();
        var apiURI = app.get_apiUrl();
        var accessToken = app.get_accessToken();
        app.update_accessToken(accessToken);
        var currentUser = app.get_user();
        app.set_user(userDetails, accessToken);
        var currentLanguage = app.get_currentLanguage();
        var defaultLanguage = app.get_defaultLanguage();
        ```
    * __baasicApiHttp__
    * __baasicApiService__
    * __baasicConstants__


* Route Services
    * every service has route service used to wrap REST service URL discovery
    * route service will parse the REST service URL and prepare the URL for expansion
    * route services contain following routes
        * _find_ - used to fetch collection of resources that can be filtered, sorted and paged
        * _get_ - used to fetch single resource
        * _create_ - used to create new resources
    * _find_ route has the following parameters
        * _searchQuery_ - used to build simple filters or complex queries
        * _page_ - used to define the current page
        * _rpp_ - used to define the number of resources per page
        * _sort_ - used to define sorting expression applied on the returned resources. Sorting expression has the following format _"fieldName|asc", "field1Name|asc,field2Name|desc"_
        * _embed_ - used to embed additional resources
        * _fields_ - used to define the list of fields returned by the service  
    * _get_ route has the following parameters
        * _embed_ - used to embed additional resources
        * _fields_ - used to define the list of fields returned by the service
    * _create_ route has the no parameters in most cases and it's used to create a new resource
    * _parse_ is an utility method used to parse custom URIs. _Note: parse will not return a route_

* Module Services
    * Baasic module services are built on top of the AngularJS services
    * module services depend upon the route services as they are used for REST service URL discovery (Note: every service exposes route service with the _routeService_ property)
    * every service has the _find_, _get_, _create_, _update_ and _remove_ functions used to communicate with the Baasic back-end
    * all services accept the data object as function parameter
* Options - Params
* HAL links
* Extending existing modules with dynamic props

### Application Settings

### Membership

* Login Service
* Password Recovery Service
* Authorization Service
* User Service
* Role Service

### Key Value Module

### Value Set Module

### Dynamic Resources Module

### General Services, Directives etc.

* recaptchaService
* recaptchaDirective

## Quick Start Guide

## Demo

## Build Process

1. Install [NodeJs](http://nodejs.org/download/)
2. Open Shell/Command Prompt in the Baasic AngularJS folder
3. Run __npm install__
4. Install gulp globally: __npm install -g gulp__
5. Run __gulp__
