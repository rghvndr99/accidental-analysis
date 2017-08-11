app.factory('fetchData', function($http, $q) {
    var factoryObj={};
    factoryObj.callData=function(filename){
       var deferred = $q.defer();
            $http({
                url:'getData',
                method:'POST',
                data:{
                    file:filename
                }
            }).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise; 
    }
    
    return factoryObj;
});
