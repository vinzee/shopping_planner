ShoppingPlanner.initMap = function () {
    ShoppingPlanner.directionsService = new google.maps.DirectionsService;
    ShoppingPlanner.directionsDisplay = new google.maps.DirectionsRenderer;
    ShoppingPlanner.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 41.85, lng: -87.65}
    });
    ShoppingPlanner.directionsDisplay.setMap(ShoppingPlanner.map);
    ShoppingPlanner.setCurrentLocation();
    ShoppingPlanner.initHomeIcon();
    ShoppingPlanner.initSearchBox();
}

ShoppingPlanner.setCurrentLocation = function () {
   if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          ShoppingPlanner.current_lat = pos.coords.latitude;
          ShoppingPlanner.current_lng = pos.coords.longitude;
          console.log('Current LatLng - [' , ShoppingPlanner.current_lat, ',' , ShoppingPlanner.current_lng , ']');
          ShoppingPlanner.map.setCenter(new google.maps.LatLng(ShoppingPlanner.current_lat, ShoppingPlanner.current_lng));
          ShoppingPlanner.addHomeMarker(new google.maps.LatLng(ShoppingPlanner.current_lat, ShoppingPlanner.current_lng));
        });
    } else {
        console.error("Geolocation is not supported by this browser !");
    }
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

ShoppingPlanner.initSearchBox = function() {
  var input = $('#pac-input').removeClass('hidden')[0];
  var searchBox = new google.maps.places.SearchBox(input);
  ShoppingPlanner.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  ShoppingPlanner.map.addListener('bounds_changed', function() {
    searchBox.setBounds(ShoppingPlanner.map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    // markers.forEach(function(marker) {
    //   marker.setMap(null);
    // });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: ShoppingPlanner.homeIcon,
        title: place.
        name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport)// Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      else
        bounds.extend(place.geometry.location);
    });
    ShoppingPlanner.map.fitBounds(bounds);

    // TODO - set this point as the current latlng
    // ShoppingPlanner.current_lat = ;
    // ShoppingPlanner.current_lng = ;
  });
}

ShoppingPlanner.addHomeMarker = function(location){
  ShoppingPlanner.addMarker(location, ShoppingPlanner.homeIcon);
}

ShoppingPlanner.addMarker = function(location, icon, title){
  icon = _.extend({}, icon);
  title = _.isNull(title) ? "Home" : title;
  var marker = new google.maps.Marker({
    map: ShoppingPlanner.map,
    icon: icon,
    title: title,
    position: location
  });  
}

ShoppingPlanner.initHomeIcon = function(){
  ShoppingPlanner.homeIcon = {
      url: "images/home.png",
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
  }
}