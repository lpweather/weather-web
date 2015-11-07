
$(document).ready(function () {
  function initializeMap() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(44.22, 8.33),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP // Options: ROADMAP, SATELLITE, HYBRID, TERRAIN
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
  }
  google.maps.event.addDomListener(window, 'load', initializeMap);
});
