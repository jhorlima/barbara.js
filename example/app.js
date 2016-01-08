var app = angular.module('App-Example', ['Barbara-Js']);

app.service("AppService", function($request){

    this.getData = function(data, success, error, load){
        $request.get('http://localhost/moca_bonita/')
                .addData(data)
                .load(load)
                .send(success, error);
    };
});

app.controller('AppController', function($scope, AppService, bootstrap) {

    $scope.alert = bootstrap.alert();
    $scope.loading = bootstrap.loading();
    $scope.pagination = bootstrap.pagination();

    $scope.requestData = function(pagination){

        AppService.getData({
            page : 'pessoa',
            action : 'teste',
            currentPage : pagination.currentPage
        }, function(data){
            $scope.data = data;
            pagination.changePages(data.pagination.pages);
            $scope.alert.responseSuccess('Você recebeu os dados com successo!');
        }, function(meta){
            $scope.data = meta;
            $scope.alert.responseError(meta);
        }, $scope.loading.getRequestLoad('Carregando informações..'));

    };

    $scope.pagination.changeCallback($scope.requestData);

    $scope.requestData($scope.pagination);

});