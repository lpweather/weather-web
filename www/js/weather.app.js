WEATHER = { };

// self initialisation
(function() {
  var app = angular.module('weather', []);

  app.controller('WeatherController', function(){
    this.product = info;
  });

  var info = {
    temperature: 45.69,
    location: "47°22′N 8°33′E",
  };
})();

WEATHER.app = (function () {

  var mapsStyle = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];

  return {
    /**
     * Draws a simple line chart with the temperature data
     * depends on the d3.js library
     * @param data {String}
     *  Path to the csv file to load
     */
    graph: function (data) {
      // Set the dimensions of the canvas / graph
      var margin = {top: 30, right: 20, bottom: 400, left: 50},
          width = ($('body').width() - 50) - margin.left - margin.right,
          height = ($('body').height() - 50) - margin.top - margin.bottom;

      console.log($('body').width());
      console.log($('body').height());

      // Parse the date / time
      var parseDate = d3.time.format("%d-%b-%y").parse;

      // Set the ranges
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      // Define the axes
      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(5);

      var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

      // Define the line
      var valueline = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

      // Adds the svg canvas
      var svg = d3.select("#graph-container")
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

      // Get the data
      d3.csv(data, function(error, data) {
          data.forEach(function(d) {
              d.date = parseDate(d.date);
              d.close = +d.close;
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.close; })]);

          // Add the valueline path.
          svg.append("path")
              .attr("class", "line")
              .attr("d", valueline(data));

      });
    },
    map: function () {
      function initializeMap() {
        var myLatlng = {lat: 47.3846794, lng: 8.5329564};

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

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Weather station @ Impact Hub'
        });

        marker.addListener('click', function() {
          map.setZoom(14);
          map.setCenter(marker.getPosition());

          $('.maximize.overlay').addClass('visible');

          $('.close').click(function () {
            if ($('.maximize.overlay').hasClass('visible')) {
              $('.maximize.overlay').removeClass('visible');
            }
          });
        });
      }

      google.maps.event.addDomListener(window, 'load', initializeMap);
    }
  };
})();