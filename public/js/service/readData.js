app.factory('fetchData', function($http, $q) {
    var deferred = $q.defer();
    $http({
        url:'getData',
        method:'POST',
        data:{
            file:'public/json/city-latlong.json'
        }
    }).then(function(response) {
        deferred.resolve(response.data);
    });
    return deferred.promise;
});
