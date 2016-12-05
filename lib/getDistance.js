/**
 * Created by devendra.lattu on 11/25/2016.
 */
var geolib = require('../node_modules/geolib/dist/geolib')

// Code snippet for getting distance through *geolib*
/*
var spots = {
    "Brandenburg Gate, Berlin": {latitude: 52.516272, longitude: 13.377722},
    "Dortmund U-Tower": {latitude: 51.515, longitude: 7.453619},
    "London Eye": {latitude: 51.503333, longitude: -0.119722},
    "Kremlin, Moscow": {latitude: 55.751667, longitude: 37.617778},
    "Eiffel Tower, Paris": {latitude: 48.8583, longitude: 2.2945},
    "Riksdag building, Stockholm": {latitude: 59.3275, longitude: 18.0675},
    "Royal Palace, Oslo": {latitude: 59.916911, longitude: 10.727567}
}

console.log(geolib.getCenter(spots));

console.log(
geolib.getCenter([
    {latitude: 52.516272, longitude: 13.377722},
    {latitude: 51.515, longitude: 7.453619},
    {latitude: 51.503333, longitude: -0.119722}
])
);
*/

var _ = require('underscore-node'),
    DistanceCalculator = {};

DistanceCalculator.find = function(path, lat, lng){
    var latlngHome = [lat, lng];
    var response = [];

    if(!_.isEmpty(path)){
        // Get minimum distance from home to individual shops in their category
        var minDistShops = [{}];
        for(var i in path){
            var minDist = 100000000;
            for(var j in path[i].data){
                var lat = path[i].data[j].coordinate[0];
                var lng = path[i].data[j].coordinate[1];

                var dist = geolib.getDistance(latlngHome, [lat, lng]);
                console.log(dist, " vs ", path[i].data[j].name, " for ", path[i]._id);

                if(dist < minDist){
                    minDistShops[i] = path[i].data[j];
                    minDist = dist;
                }
            }
        }

        // Print the results obtained above
        console.log('\nminDistShops : \n', JSON.stringify(minDistShops), '\n');

        // matrix operations to get distance
        var matSize = minDistShops.length + 1;
        var mat = [];

        // create a empty array to be pushed into matrix
        for(var i = 0; i < matSize; i++){
            mat.push(new Array());
        }
        mat[0].push(0);


        //fill the matrix with distance values from home
        for(var i = 0; i < minDistShops.length; i++){
            var coords = minDistShops[i].coordinate;
            var dist = geolib.getDistance(latlngHome, coords);

            mat[0].push(dist);
            mat[i + 1].push(dist);
        }

        // fill the matrix with distance values from home
        for(var i = 0; i < minDistShops.length; i++){
            var coords_i = minDistShops[i].coordinate;
            for(var j = i; j < minDistShops.length; j++){

                if(i == j){
                    mat[i + 1].push(0);
                    continue;
                }

                var coords_j = minDistShops[j].coordinate;
                var dist = geolib.getDistance(coords_i, coords_j);

                mat[i + 1].push(dist);
                mat[j + 1].push(dist);
            }
        }

        // print matrix values
        for(var i = 0; i < matSize; i++) {
            var matRow = '';
            for (var j = 0; j < matSize; j++)
                matRow = matRow + mat[i][j] + '  ';
            console.log(matRow);
        }

        // get max sum row
        var maxRow = -1;
        var rowIndex = 0;
        for(var i = 0; i < matSize; i++){
            var sumRow = 0;
            for(var j = 0; j < matSize; j++){
                sumRow += mat[i][j];
            }

            if(sumRow > maxRow){
                maxRow = sumRow;
                rowIndex = i;
            }
        }

        // save mat[rowIndex] to a new array and get it's indices.
        var arr = [];
        for(var i = 1; i < matSize; i++)
            arr.push(mat[rowIndex][i]);

        //set default indices
        var newIndices = [];
        for(var i = 0; i < arr.length; i++)
            newIndices.push(i);

        // sort elements of arr to form sequence of shopping route
        for(var i = 0; i < arr.length; i++){
            for(var j = i + 1; j < arr.length; j++){
                if(arr[i] > arr[j]){
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;

                    // swap indices
                    temp = newIndices[i];
                    newIndices[i] = newIndices[j];
                    newIndices[j] = temp;
                }
            }
        }

        // Final distance
        var prevCoords = latlngHome;
        var finalDist = 0;

        for(var i in newIndices){
            var index = newIndices[i];

            response.push(minDistShops[index]);

            //getting actual final distance
            var currentCoords = minDistShops[index].coordinate;
            finalDist += geolib.getDistance(prevCoords, currentCoords);

            //updating previous coords
            prevCoords = currentCoords;
        }

        //dist back to home
        finalDist += geolib.getDistance(prevCoords, latlngHome);

        console.log("Final distance = " + finalDist);
    }else{
        response.err = "Error while getting distance";
    }

    return response;
}

module.exports = DistanceCalculator;