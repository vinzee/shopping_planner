ShoppingPlanner.initMap = function () {
    ShoppingPlanner.directionsService = new google.maps.DirectionsService;
    ShoppingPlanner.directionsDisplay = new google.maps.DirectionsRenderer;
    ShoppingPlanner.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 41.85, lng: -87.65}
    });
    ShoppingPlanner.directionsDisplay.setMap(ShoppingPlanner.map);
}

ShoppingPlanner.calculateAndDisplayRoute = function(coordinates) {
    var waypts = _.map(coordinates, function(coordinate){
        return { location: coordinate[0]+","+coordinate[1], stopover: true };
    });

    ShoppingPlanner.directionsService.route({
    origin: ShoppingPlanner.current_lat+","+ShoppingPlanner.current_lng,
    destination: ShoppingPlanner.current_lat+","+ShoppingPlanner.current_lng,
    waypoints: waypts,
    //waypoints:   ['Vancouver, BC', 'Seattle, WA'],
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      ShoppingPlanner.directionsDisplay.setDirections(response);

      var route = response.routes[0];
      var summaryPanel_html = "";
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
          summaryPanel_html += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
          summaryPanel_html += route.legs[i].start_address + ' to ';
          summaryPanel_html += route.legs[i].end_address + '<br>';
          summaryPanel_html += route.legs[i].distance.text + '<br><br>';
      }
      $('#directions-panel').html(summaryPanel_html);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}