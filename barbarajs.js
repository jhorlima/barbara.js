var barbaraJs = angular.module('Barbara-Js', []);

barbaraJs.config( function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

barbaraJs.factory("$request", function($http){

    var callbackSuccess = function(response, request, success, error){

        if(!request.checkMeta)
            success(response);

        else if(!angular.isObject(response.data))
            error({
                code          : response.status,
                error_message : response.statusText
            }, response.status, response);

        else if(angular.isObject(response.data.meta)){
            if(response.data.meta.code == 200)
                success(response.data.data, response.data.meta, response);

            else
                error(response.data.meta, response.status, response);

            angular.forEach(request.callback, function(callback) {
                if(this.code == callback.metaCode)
                    callback.callback(response.data.data, response.data.meta, response);
            }, response.data.meta);

        } else
            error({
                code          : response.status,
                error_message : response.statusText
            }, response.status, response);

    };

    var callbackError   = function(response, error){
        error({
            code          : response.status,
            error_message : response.statusText
        }, response.status, response);
    };

    return {
        parameter     : {},
        headers       : {},
        method        : 'GET',
        url           : undefined,
        callback      : [],
        checkMeta     : true,
        response      : undefined,
        checkResponse : function(check){
            this.checkMeta = check ? true : false;
            return this;
        },
        addCallback   : function(metaCode, callback){
            if(angular.isNumber(metaCode) && angular.isFunction(callback))
                this.callback.push({ metaCode : metaCode, callback : callback });
            return this;
        },
        addMethod     : function(method){
            this.method = angular.isString(method) ? method : 'GET';
            return this;
        },
        addData       : function(param){
            this.parameter = angular.isObject(param) ? param : {};
            return this;
        },
        addHeaders    : function(headers){
            this.headers = angular.isObject(headers) ? headers : {};
            return this;
        },
        get           : function(url){
            this.url = angular.isString(url) ? url : this.url;
            this.addMethod('GET');
            return angular.copy(this);
        },
        post          : function(url){
            this.url = angular.isString(url) ? url : this.url;
            this.addMethod('POST');
            return angular.copy(this);
        },
        put           : function(url){
            this.url = angular.isString(url) ? url : this.url;
            this.addMethod('PUT');
            return angular.copy(this);
        },
        delete        : function(url){
            this.url = angular.isString(url) ? url : this.url;
            this.addMethod('DELETE');
            return angular.copy(this);
        },
        send          : function(success, error){

            var request = this;

            if(!angular.isFunction(success) || !angular.isFunction(error))
                throw "Callback invalid in $request!";

            switch (request.method){

                case 'GET' :
                    $http.get(request.url, { params: request.parameter, headers : request.headers })
                         .then(function(response){
                             callbackSuccess(response, request, success, error);
                         }, function(response){
                             callbackError(response, error);
                         });
                break;

                case 'POST' :
                    $http.post(request.url, request.parameter, { headers : request.headers })
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, error);
                        });
                break;

                case 'PUT' :
                    $http.put(request.url, request.parameter, { headers : request.headers })
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, error);
                        });
                break;

                case 'DELETE' :
                    $http.delete(request.url, { params: request.parameter, headers : request.headers })
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, error);
                        });
                break;
            }
        }
    };
});

barbaraJs.factory("Bootstrap", function(){
    return {
        alert : function(){
            return {
                show          : false,
                changeShow    : function( show ){
                    this.show = angular.isDefined(show) ? show : !this.show;
                },
                type          : undefined,
                changeType    : function(type){
                    this.type = type;
                },
                title         : undefined,
                changeTitle   : function(title){
                    this.title = title;
                },
                message       : undefined,
                changeMessage : function(message){
                    this.message = message;
                },
                responseError : function(meta){

                    this.changeType('danger');

                    if(angular.isDefined(meta.error_message) && angular.isString(meta.error_message)){
                        this.changeMessage(meta.error_message);
                        this.changeType('warning');
                    } else
                        this.changeMessage("Ocorreu um erro na requisição! Talvez o servidor " +
                                           "esteja em manutenção.");
                }
            };
        }
    };
});

barbaraJs.directive( 'alertBootstrap', function (pathPlugin) {
    return {
        restrict    : 'A',
        templateUrl : pathPlugin + 'view/directive/alert.html',
        link        : function( scope, link, attr ){

        }
    };
});