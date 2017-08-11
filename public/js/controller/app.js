var app = angular.module('map-app', []);

app.controller('mapCtrl', ['$scope', 'fetchData', function($scope, fetchData) {
    $scope.chkData=[
                    {
                    "lblFor":"acc-total",
                    "lblClass":"btn-info",
                    "chkAccType":"Total",
                    "isChecked":"true"
                },
                {
                    "lblFor":"acc-injured",
                    "lblClass":"btn-primary",
                    "chkAccType":"Injured",
                    "isChecked":"false"
                },
                {
                "lblFor":"acc-fatal",
                "lblClass":"btn-warning",
                "chkAccType":"Fatal",
                "isChecked":"false"
               },
                {
                "lblFor":"acc-killed",
                "lblClass":"btn-danger",
                "chkAccType":"Killed",
                "isChecked":"false"
               }
            ];
    $scope.checkedCheckBoxes=[$scope.chkData[0].chkAccType];    
    $scope.checkUncheck=function(item){
        if($scope.checkedCheckBoxes.length>0 &&$scope.checkedCheckBoxes.indexOf(item)==-1){
            $scope.checkedCheckBoxes.push(item);
        }
        else if($scope.checkedCheckBoxes.indexOf(item)>-1){
            $scope.checkedCheckBoxes.splice(item,1);
            if($scope.checkedCheckBoxes.length==0){
                $scope.checkedCheckBoxes.push($scope.chkData[0].chkAccType);
            } 
        }
        initialize();
    }
    $scope.colorseriesmapping={
                    "Injured":{
                        "color":"blue",
                        "image":"blue.png"
                    },
                     "Total":{
                        "color":"green",
                        "image":"green.png"
                    },
     
                     "Fatal":{
                        "color":"#FF4500",
                        "image":"orange.png"
                    },
                    "Killed":{
                        "color":"red",
                        "image":"red.png"
                    }
     
                };
    google.maps.event.addDomListener(window, 'load', initialize);
    var time = [2006, 2007, 2008, 2009, 2010, 2011, 2012];
    var sliderElement=angular.element(document.getElementById("rangeslider"));
        sliderObj = sliderElement.ionRangeSlider({
            type: "double",
            grid: true,
            from: 0,
            to: time[time.length - 1],
            values: time,
            onFinish: function() {
                initialize();
            }
        }).data("ionRangeSlider");  
       
    function initialize() {
        var promiseArr=[];
        promiseArr.push(fetchData.callData('public/json/stateboundry.json'),fetchData.callData('public/json/city-latlong.json'));       Promise.all(promiseArr).then(function(totalData){
            let data=totalData[1];
            let stateBoundrydata=totalData[0];
            generateMapUI(data,stateBoundrydata);
        });
        function generateMapUI(data,stateBoundrydata) {
                    let mapOptions = {
                zoom: 5,
                center: new google.maps.LatLng(20.5937, 78.9629)
            };
            let seriesnameDominating=$scope.colorseriesmapping;
            let infowindow = new google.maps.InfoWindow({}),
                map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
                totalNo = 0;
            let timeLvl = [],
                timeType = $scope.checkedCheckBoxes;
            //calculate time level
            for (let timeIndexStart = sliderObj.result.from_value; timeIndexStart <= sliderObj.result.to_value; timeIndexStart++) {
                timeLvl.push(timeIndexStart.toString());
            }
            // calculate type from checkboxs
            for (let key in data) {
                let obj = data[key],
                    NoOfData = [],
                    seriesNameData = {};
                for (let keyData in obj) {
                    if (timeLvl.indexOf(keyData) != -1) {
                        for (let timeIndex = 0; timeIndex < timeType.length; timeIndex++) {
                            if (!seriesNameData.hasOwnProperty(timeType[timeIndex])) {
                                seriesNameData[timeType[timeIndex]] = [];
                            }
                            seriesNameData[timeType[timeIndex]].push(parseInt(data[key][keyData][timeType[timeIndex]]));
                            NoOfData.push(parseInt(data[key][keyData][timeType[timeIndex]]));

                        }
                    }
                }
                totalNo = NoOfData.reduce(function(total, ele) {
                    return total + ele;
                });
                let latLng = new google.maps.LatLng(obj['lat'], obj['lng']);
                let mapOptions = {
                    zoom: 6,
                    center: latLng
                };
                let dominating_series=findMaxSeriesname(),
                    image=seriesnameDominating[dominating_series]['image'],
                    color=seriesnameDominating[dominating_series]['color'];
                let marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: '',
                    icon: 'img/'+image
                });

                google.maps.event.addListener(marker, 'click', function initialize() {
                    initializeMap();
                });

                function initializeMap() {
                    angular.element(document.getElementById("myModal")).modal();
                    let seriesNm = [];
                    for (let seriesName in seriesNameData) {
                        var seriesNameData1 = {};
                        seriesNameData1['name'] = seriesName;
                        seriesNameData1['data'] = seriesNameData[seriesName];
                        seriesNm.push(seriesNameData1);
                    }
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: key
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: timeLvl,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'No of Accident'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: seriesNm
                    });
                }
            function findMaxSeriesname(){
                let seriesNm=[];                
                for (let seriesName in seriesNameData) {
                        var seriesNameData1 = {};
                        seriesNameData1['name'] = seriesName;
                        seriesNameData1['data'] = seriesNameData[seriesName].reduce(function(a,b){return a+b});
                        seriesNm.push(seriesNameData1);
                }
              let series='Total',maxNo=0; 
              for(let index=0;index<seriesNm.length;index++){
                  if(seriesNm[index]['data']>maxNo){
                      maxNo=seriesNm[index]['data'];
                      series=seriesNm[index]['name'];
                  }
              }
            return series;
            }
                var triangleCoords =stateBoundrydata[key];
                         // Construct the polygon.
                var bermudaTriangle = new google.maps.Polygon({
                  paths: triangleCoords,
                  strokeColor: color,
                  strokeOpacity: 0.9,
                  strokeWeight: 2,
                  fillColor: color,
                  fillOpacity: 0.1
                });
                bermudaTriangle.setMap(map);

            }
            }
    }
}]);
