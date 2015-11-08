WEATHER = { };

// self initialisation
(function() {
  var app = angular.module('weather', []);

  app.controller('WeatherController', ['$scope', '$http', function ($scope, $http) {
    $http({
      method: 'GET',
      url: '/sensors'
    }).then(function successCallback(response) {
      response.data.items.forEach(function(item) {
        var positions = item.position.split(':');
        var n = Number((parseFloat(positions[0])).toFixed(3));
        var e = Number((parseFloat(positions[1])).toFixed(3));
        $('#position').html("N: " + n + " E: " + e);
        $('#station-name').html("(" + item.deveuid + ")");
      }, function errorCallback(response) {
        $('#position').html('error while getting position.');
      });
    });
  }]);
})();

WEATHER.app = (function () {

  var mapsStyle = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];
  var chart;
  var timeout;
  var label = [],
      temparature = [],
      lumen = [],
      light = [];


  function updateChart(devid, callback) {
    $.get('/' + devid, function (res) {

      label = [];
      temparature = [];
      lumen = [];
      light = [];

      var options = {
        fullWidth: true,
        height: 500,
        showArea: true,
        legendNames: ["Temperature", "Luminosity", "Light"],
        plugins: [
            Chartist.plugins.legend()
        ]
      };

      for (var i in res.data) {$
        if (res.data[i].type == 'temparature') {
          temparature.push(res.data[i].value);
          label.push(res.data[i].timestamp)
        }
        if (res.data[i].type == 'lumen') {
          lumen.push(res.data[i].value * 20);
        }
        if (res.data[i].type == 'light') {
          light.push(res.data[i].value * 10);
        }
      }

      // Create a simple line chart
      var data = {
        // A labels array that can contain any sort of values
        labels: label,
        // Our series array that contains series objects or in this case series data arrays
        series: [
          temparature,
          lumen,
          light
        ],
        legendNames: ["Temperature", "Luminosity", "Light"]
      };

      callback(data, options);
    });
  }

  return {
    /**
     * Draws a simple line chart with the temperature data
     * depends on the d3.js library
     * @param data {String}
     *  Path to the csv file to load
     */
    graph: function (devid) {

        timeout = setInterval(function () {
          updateChart(devid, function(data, options) {
            if (chart) {
              chart.update(data, options);
            } else {
              chart = new Chartist.Line('#graph-container', data, options);
            }
            $('#ct-lables').remove();
          });
      }, 2000);
    },
    map: function () {
      function initializeMap() {

        // create map
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(47.3846794, 8.5329564),
            zoom: 12,
            styles: mapsStyle,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var map = new google.maps.Map(mapCanvas, mapOptions);

        // get data and create markers
        $.get('/sensors', function (response) {
          response.items.forEach(function(item) {
            var positions = item.position.split(':');
            var myLatlng = {lat: parseFloat(positions[0]), lng: parseFloat(positions[1])};
            var marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: 'Weather station ' + item.deveuid
            });

            marker.addListener('click', function() {
              //map.setZoom(14);
              map.setCenter(marker.getPosition());

              WEATHER.app.graph(item.deveuid);

              $('.maximize.overlay').addClass('visible');

              $('.close').click(function () {
                clearInterval(timeout);
                if ($('.maximize.overlay').hasClass('visible')) {
                  $('.maximize.overlay').removeClass('visible');
                }
              });
            });
          });
        });
      }
      google.maps.event.addDomListener(window, 'load', initializeMap);
    }
  };
})();
