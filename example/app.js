var app = angular.module('App-Example', ['Barbara-Js']);

app.service("AppService", function($request){

    this.getData = function(data, success, error){
        $request.get('http://localhost/rest.php')
                .addData(data)
                .send(success, error);
    };

    this.getData2 = function(data, success, error){
        $request.delete('http://localhost/rest.php')
                .addData(data)
                .addCallback(401, function(){
                    console.log("teste");
                })
                .send(success, error);
    };
});

app.controller('AppController', function($scope, AppService) {

    AppService.getData({bla: 'bla'}, function(data){
        console.debug(data);
    }, function(data){
        console.log(data);
    });

    AppService.getData2({bla1: 'bla2'}, function(data){
        console.debug(data);
    }, function(data){
        console.log(data);
    });
});