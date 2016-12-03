ShoppingPlanner.initMap = function () {
    ShoppingPlanner.directionsService = new google.maps.DirectionsService;
    ShoppingPlanner.directionsDisplay = new google.maps.DirectionsRenderer;
    ShoppingPlanner.geocoder = new google.maps.Geocoder();
    ShoppingPlanner.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 41.85, lng: -87.65}
    });
    ShoppingPlanner.directionsDisplay.setMap(ShoppingPlanner.map);
    ShoppingPlanner.setCurrentLocation();
    ShoppingPlanner.initHomeIcon();
    ShoppingPlanner.initSearchBox();
    ShoppingPlanner.markers = [];
    // ShoppingPlanner.initForm();

    setTimeout(function(){
        $('#pac-input').removeClass('hidden');
    }, 700);
}

ShoppingPlanner.setCurrentLocation = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            ShoppingPlanner.current_lat = pos.coords.latitude;
            ShoppingPlanner.current_lng = pos.coords.longitude;
            ShoppingPlanner.geocode(ShoppingPlanner.current_lat, ShoppingPlanner.current_lng);
            ShoppingPlanner.map.setCenter(new google.maps.LatLng(ShoppingPlanner.current_lat, ShoppingPlanner.current_lng));
            ShoppingPlanner.addHomeMarker(new google.maps.LatLng(ShoppingPlanner.current_lat, ShoppingPlanner.current_lng), 'My home');
        });
    } else {
        console.error("Geolocation is not supported by this browser !");
    }
}

ShoppingPlanner.calculateAndDisplayRoute = function (coordinates) {
    var waypts = _.map(coordinates, function (coordinate) {
        return {location: coordinate[0] + "," + coordinate[1], stopover: true};
    });

    ShoppingPlanner.directionsService.route({
        origin: ShoppingPlanner.current_lat + "," + ShoppingPlanner.current_lng,
        destination: ShoppingPlanner.current_lat + "," + ShoppingPlanner.current_lng,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            ShoppingPlanner.directionsDisplay.setDirections(response);

            var route = response.routes[0];
            var summaryPanel_html = "";
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
                summaryPanel_html += '<b>Route Segment: ' + i + 1 + '</b><br>' +
                                    route.legs[i].start_address + ' to ' +
                                    route.legs[i].end_address + '<br>' +
                                    route.legs[i].distance.text + '<br><br>';
            }
            $('#directions-panel').html(summaryPanel_html).removeClass('hidden');
        } else {
            ShoppingPlanner.error('Failed to load Directions.');
            console.error('Directions request failed due to ' + status);
        }
    });
}

ShoppingPlanner.initForm = function () {
    ShoppingPlanner.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push($('#left-panel')[0]);
    $('#left-panel').removeClass('hidden');
}

ShoppingPlanner.initSearchBox = function () {
    var input = $('#pac-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    ShoppingPlanner.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    ShoppingPlanner.map.addListener('bounds_changed', function () {
        searchBox.setBounds(ShoppingPlanner.map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();

        place = places[0];
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        // Create a marker for each place.
        ShoppingPlanner.addMarker(place.geometry.location, place.name);

        if (place.geometry.viewport)// Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        else
            bounds.extend(place.geometry.location);

        ShoppingPlanner.map.fitBounds(bounds);

        ShoppingPlanner.current_lat = place.geometry.location.lat();
        ShoppingPlanner.current_lng = place.geometry.location.lng();
    });
}

ShoppingPlanner.addHomeMarker = function (location, title, content) {
    ShoppingPlanner.deleteAllMarkers();
    ShoppingPlanner.addMarker(location, title, content, ShoppingPlanner.homeIcon);
}
ShoppingPlanner.deleteAllMarkers = function(){
    _.each(ShoppingPlanner.markers, function(marker){
        marker.setMap(null);
    });
}

ShoppingPlanner.addMarker = function (location, title, content, icon) {
    content = _.isEmpty(content) ? '' : content;

    var marker = new google.maps.Marker({
        map: ShoppingPlanner.map,
        icon: icon,
        title: title,
        position: location
    });

    var final_content = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h5 id="firstHeading" class="firstHeading">' + title + '</h5>'+
            '<div id="bodyContent">'+ content + '</div>'+
            '</div>'
    var infowindow = new google.maps.InfoWindow({
        content: final_content
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

ShoppingPlanner.initHomeIcon = function () {
    ShoppingPlanner.homeIcon = {
        url: "images/home.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    }
}

ShoppingPlanner.geocode = function(lat, lng){
    var latlng = new google.maps.LatLng(lat, lng);
    ShoppingPlanner.geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK){
          if(results[1]){
            $('#current_location').text(results[1].formatted_address);
          }else{
            ShoppingPlanner.error('No results found');
          }
        }else{
          ShoppingPlanner.error('Error in getting current location.');
          console.error('Error geocoding current location.', status);
        }
    });
}
