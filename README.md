# Baasic Core AngularJS SDK

The Baasic AngularJS core library provides integration access to the Baasic Service [REST API](https://api.baasic.com). 

## Dependencies

Baasic AngularJS Core library has the following dependencies 

* [Baasic JavaScript Framework](https://github.com/Baasic/baasic-sdk-javascript)
* [AngularJS](http://www.angularjs.org/)(>= 1.2.16)
* [HAL Parser](https://github.com/Baasic/angular-hal)
* [URI Template](https://github.com/Baasic/uritemplate-js)

## Usage

This section will describe how to add the Baasic AngularJS core library to your project. It's important to know that Baasic AngularJS SDK is using HAL+JSON format for back-end communication, you can find more information about HAL format [here](http://stateless.co/hal_specification.html).  

If you learn best by example please move forward to the [Demo Section](#demo)

### Add the Library to Your Project

It is recommended to serve the library from the CDN (Content Delivery Network) but note that this isn't required. Please add the following lines of code after loading the AngularJS. 

    <script src='//cdn.net/js/hal-parser.js'></script>
    <script src='//cdn.net/js/uritemplate-min.js'></script>
	<script src='//cdn.net/js/baasic-angular-1.0.0.min.js'></script>

### Initialize

To use the library you need to add the Baasic (_baasic.api_) dependency to your AngularJS module. This will allow you to use library services described in the [Modules Section](#baasic-modules).

	 angular.module('my-module', ["baasic.api"])		

### Application Configuration

Baasic AngularJS library allows you to use multiple Baasic applications in your AngularJS modules. To initialize Baasic application you need to add the following code to you module configuration.

		module.config(["baasicAppProvider",
			function (baasicAppProvider) {
				var app = baasicAppProvider.create("my-app-identifier", {
                    apiRootUrl: "api.baasic.com",
                    apiVersion: "v1"
                });
			}]);


**Note:** _To obtain Baasic Application Identifier please create your application on the [Baasic Registration](https://dashboard.baasic.com/register/) page._

## Baasic Modules

Baasic back-end has many built-in modules that can be used with Baasic AngularJS library. Below you can find short list of modules supported by Baasic AngularJS SDK. 

* [Security service](https://github.com/Baasic/baasic-sdk-angularjs-security) 
* [Membership service](https://github.com/Baasic/baasic-sdk-angularjs-membership)
* [Application settings service](https://github.com/Baasic/baasic-sdk-angularjs-app-settings)
* [Key Value module service](https://github.com/Baasic/baasic-sdk-angularjs-key-value)
* [Value Set module service](https://github.com/Baasic/baasic-sdk-angularjs-value-set)
* [Dynamic Resources module service](https://github.com/Baasic/baasic-sdk-angularjs-dynamic-resource)
* [Article module service](https://github.com/Baasic/baasic-sdk-angularjs-articles)
* General services, directives etc.


### Baasic Module Architecture

To get better understanding of Baasic AngularJS services here are the details about main architecture that all library services conform to. 

* Core Services
	* __baasicApp__ service is used to manage the Baasic application instances. There can be multiple AngularJS application instances communicating with difference Baasic applications. 

		*  create an application 

				module.controller("MyCtrl", ["baasicApp",
					function MyCtrl(baasicApp) {
						var app = baasicApp.create("my-app-identifier", {
		                    apiRootUrl: "api.baasic.com",
		                    apiVersion: "v1"
	                	});
					}]);   

		* get default application 

				module.controller("MyCtrl", ["baasicApp",
					function MyCtrl(baasicApp) {
						var app = baasicApp.get();
					}]);   

    	* application object has the following methods

				var apiKey = app.get_apiKey();
				var apiURI = app.get_apiUrl();
				var accessToken = app.get_accessToken();
				app.update_accessToken(accessToken);
				var currentUser = app.get_user();
				app.set_user(userDetails, accessToken);
				var currentLanguage = app.get_currentLanguage();
				var defaultLanguage = app.get_defaultLanguage();
	    	
    
	* **baasicApiHttp**
	
		Baasic HTTP service is used to perform low level communication with the Baasic back-end. 

		Baasic HTTP service will handle:  
		
		* authentication tokens 
		* HAL parsing
 
	* **baasicApiService**

		Service is used to perform low level model or option transformations before they are sent to Baasic back-end. 

		Following transformations are supported:

		* Resource collection fetch transformation
		* Single resource fetch transformation
		* Create resource transformation
		* Update resource transformation
		* Delete resource transformation


	* **baasicConstants**

		Baasic constants contain values like _id_ property name, _model_ property name parameters that can be used if manual model or option transformation is needed. 

* Route Services
	* every service has route service used to define REST service URL discovery 
	* route service will parse the REST service URL and prepare the URL for expansion 
	* route services contain following routes
		* _find_ - used to fetch collection of resources it can be filtered, sorted and paged
		* _get_ - used to fetch single resource
		* _create_ - used to create new resources
	* _find_ routes has the following parameters
		* _searchQuery_ - used to build simple filters or complex queries (read more about Baasic Query Language in Baasic User Manual)
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

* HAL links

	Resources returned from Baasic will be, by default, in HAL format looking similar to this:

	    {
	    	"key": "your-key",
	    	"value": "your-value",
	    	"dateCreated": "2015-01-01T14:24:56.795849Z",
	    	"dateUpdated": "2015-01-01T14:24:56.795849Z",
	    	"id": "4f788120-7cf8-44e1-bf81-a33e012c94ee",
	    	"_links": {
	    		"self": {
	    			"href": "http://api.baasic.local/v1/your-app-id/key-values/your-key",
	    			"templated": false
	    		},
	    		"post": {
	    			"href": "http://api.baasic.local/v1/your-app-id/key-values",
	    			"templated": false
	    		},
	    		"put": {
	    			"href": "http://api.baasic.local/v1/your-app-id/key-values/your-key",
	    			"templated": false
	    		},
	    		"delete": {
	    			"href": "http://api.baasic.local/v1/your-app-id/key-values/your-key",
	    			"templated": false
	    		}
	    	},
	    	"_embedded": { }
	    }

	**Note**: It is recommended to use AngularJS SDK services to access the Baasic back-end, for manual access to the back-end URLs use the following code


    	data.links('put').href
    	data.links('delete').href

	or create your own _update_ function by using Baasic core services

        update: function (data) {
            var params = baasicApiService.updateParams(data);
            return baasicApiHttp.put(params[baasicConstants.modelPropertyName].links('put').href, params[baasicConstants.modelPropertyName]);
        },
   

* Extending models 

	Baasic built-in models can be extended with custom properties simply by setting property value.

		article.myProperty = 1;
		article.myPropertyObject = {
			firstProp: 1,
			secondProp: 2
		}

        update: function (article) {
            return articleService.update(article);
        }

 	This powerful features allows you to extend all built-in models with custom properties and make modules like Article suite your needs.

## Demo

* [Agency Demo](http://demo.baasic.com/AngularJS/Agency)

## Build Process

1. Install [NodeJs](http://nodejs.org/download/)
2. Open Shell/Command Prompt in the Baasic AngularJS folder 
3. Run __npm install__
4. Install gulp globally: __npm install -g gulp__ 
5. Run __gulp__

## Contribute

* Pull requests are always welcome

We appreciate pull requests, and we do our best to process them as quickly as possible. If there is just a typo, small or large issue Do it! It will help us a lot.

If your pull request is not accepted on the first try, don't be discouraged! If there's a problem with the implementation, hopefully you received feedback on what to improve.

* Report issues 

Please check for existing issue before you create one, if it does exist add a quick _+1_ or _I have the same problem_

* Help us write documentation
* Create interesting apps using SDK
* Looking for something else to do? Get in touch  