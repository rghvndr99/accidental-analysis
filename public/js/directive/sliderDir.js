app.directive("rangeslider",function(){
    return {
        restrict:"E",
        scope:{
            'timedata':'=',
            'initializeMap':'&map',
            'sliderObj':'='
        },
        link:function(scope,elem,attr){
            var element=$(elem);
             var time = scope.timedata;
            var sliderObj=element.ionRangeSlider({
            type: "double",
            grid: true,
            from: 0,
            to: time[time.length - 1],
            values: time,
            onFinish: function() {
                scope.initializeMap();
            }
          }).data("ionRangeSlider");
        console.log('RDX-'+sliderObj);
        }
    }
})