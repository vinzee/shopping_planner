'use strict';

var ShoppingPlanner = {};

$(document).ready(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          ShoppingPlanner.current_lat = pos.coords.latitude;
          ShoppingPlanner.current_lng = pos.coords.longitude;
          ShoppingPlanner.map.setCenter(new google.maps.LatLng(ShoppingPlanner.current_lat, ShoppingPlanner.current_lng))
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    $('#radius_slider').change(function(){
      $('#radius').text($(this).val());
    });

    $("#get_direction_button").click(function(){
        var data = {};
        data.product_types = [];

        $.each($("[name='category']:checked"), function(){
          data.product_types.push($(this).val());
        });

        data.radius = $('#radius_slider').val();
        data.lat = ShoppingPlanner.current_lat;
        data.lng = ShoppingPlanner.current_lng;

        if(data.product_types.length == 0){
          console.error('No categories selected');
          return;
        }

        console.log(data);
        $.ajax({
          type:"post",
          dataType:"json",
          url: "/get_shortest_path",
          data: data,
          success: function(result){
            console.log("Yay !", result);
          },
          error: function(a, b, c){
            console.error("Ajax Error - ", a.responseJSON);
          }
        });
    });
});

