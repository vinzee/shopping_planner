'use strict';

var ShoppingPlanner = {};

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('#radius_slider').slider().change(function () {
        $('#radius').text($(this).val());
    });

    $.ajax({
        dataType: "json",
        url: 'jsonData/distinct.json',
        success: function (result) {
            var subcategories = _.map(result.subcategory, function (subcategory) {
                return {id: subcategory, text: subcategory};
            });

            $("#subcategory").select2({
                placeholder: 'Select categories',
                data: subcategories,
                multiple: true,
                maximumSelectionLength: 5
            });
        }
    });

    $("#get_direction_button").click(function () {

        var data = {};
        data.product_types = $("#subcategory").select2('val');
        data.radius = $('#radius_slider').val();
        data.lat = ShoppingPlanner.current_lat;
        data.lng = ShoppingPlanner.current_lng;

        if (data.product_types.length == 0) {
            ShoppingPlanner.showError('Please select atleast one category ! ');
            return;
        }

        console.log('Before Ajax', data);
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/get_shortest_path",
            data: data,
            success: function (result) {
                console.log("Ajax Success - ", result);
                ShoppingPlanner.dist = result.dist / 1000;
                $("#totalDist").text("Total Distance : " + ShoppingPlanner.dist + " km").removeClass('hidden');
                ShoppingPlanner.calculateAndDisplayRoute(result.path);

                if(_.isArray(result.err) && result.err.length > 0){
                    _.each(result.err, function(err){
                        ShoppingPlanner.showError(err);
                    })
                }
            },
            error: function (a, b, c) {
                console.error("Ajax Error - ", a.responseJSON);
                if(_.isArray(a.responseJSON)){
                    _.each(a.responseJSON, function(err){
                        ShoppingPlanner.showError(err);
                    })
                }
            }
        });
    });

    $("#totalDist").on('click', function(){
        if($("#totalDist").hasClass('km')){
            $("#totalDist").removeClass('km').addClass('miles').text("Total Distance : " + ((ShoppingPlanner.dist/1.60934).toFixed(2)) + " miles");
        }
        else if($("#totalDist").hasClass('miles')){
            $("#totalDist").removeClass('miles').addClass('km').text("Total Distance : " + (ShoppingPlanner.dist) + " km");
        }{

        }
    });

    $("#go_to_current_location_button").click(function(e){
        ShoppingPlanner.setCurrentLocation();
    });
});

ShoppingPlanner.showError = function (msg) {
    $('.bottom-left').notify({
        message: {text: msg},
        type: 'warning'
    }).show();
}