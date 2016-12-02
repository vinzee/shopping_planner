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
    DistanceCalculator = {},
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    Product = mongoose.models.Product;

var latlngHome = [39.2610719, -76.6987073];

DistanceCalculator.find = function(path){
    var response = { coords: [] };
    console.log('DistanceCalculator.find params ->', path)

    if(!_.isEmpty(path)){

        // Get unique count of shops and their names

        var lat_lng_arr = [];

        var uniqueId = '';
        var uniqueShopNames = [];
        var uniqueShopCount = [];
        var countId = 0;

        for(var obj in path){
            var id = path[obj]._id;
            if(uniqueId !== id){
                countId++;
                uniqueId = id;
                uniqueShopNames.push(uniqueId);

                var dataObj = path[obj].data;
                uniqueShopCount.push(dataObj.length);
            }
        }

        console.log("countId = " + countId);                    //3
        console.log("uniqueShopNames = " + uniqueShopNames);    //Bank,Doctor,Electrical
        console.log("uniqueShopCount = " + uniqueShopCount);    //7,22,1

        // Get minimum distance from home to individual shops in their category

        var minDistShops = [{}];
        for(var obj in path){
            var id = path[obj]._id;
            var dataObj = path[obj].data;
            var minDist = 100000;

            console.log("GETTING DIST FOR SHOP : " + id + " FROM HOME");
            for(var d in dataObj){
                var lng = dataObj[d].coordinate[0];
                var lat = dataObj[d].coordinate[1];

                var dist = geolib.getDistance(latlngHome, [lat, lng]);
                console.log(dist);

                if(dist < minDist){
                    minDistShops[obj] = {
                        "name":dataObj[d].name,
                        "coordinate":[lat, lng]
                    }
                }
            }
        }

        // Print the results obtained above

        for(var obj in minDistShops){
            var name = minDistShops[obj].name;
            var coords = minDistShops[obj].coordinate;

            console.log("Name : " + name + " Coords = " + coords);
        }

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

        //fill the matrix with distance values from home
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
            for (var j = 0; j < matSize; j++) {
                matRow = matRow + mat[i][j] + '  ';
            }
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

        console.log("rowIndex in matrix = " + rowIndex + " with maxRow sum = " + maxRow);

        // save mat[rowIndex] to a new array and get it's indices.
        var arr = [];
        for(var i = 1; i < matSize; i++){
            arr.push(mat[rowIndex][i]);
        }

        console.log("arr = ", arr);

        //set default indices
        var newIndices = [];
        for(var i = 0; i < arr.length; i++){
            newIndices.push(i);
        }

        //sort elements of arr to form sequence of shopping route
        for(var i = 0; i < arr.length; i++){
            for(var j = i + 1; j < arr.length; j++){
                if(arr[i] > arr[j]){
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;

                    console.log("BUBBLE SORT arr = ", arr);
                    //swap indices
                    temp = newIndices[i];
                    newIndices[i] = newIndices[j];
                    newIndices[j] = temp;
                }
            }
        }

        console.log("New indices = " + newIndices);

        // Final distance
        var prevCoords = latlngHome;
        var finalDist = 0;

        var finalPath = 'H->';
        var finalCoords = [];
        for(var obj in newIndices){
            var index = newIndices[obj];

            //console purpose
            var shopCoords = minDistShops[index].coordinate[0] + ' & ' + minDistShops[index].coordinate[1];
            var shopName = minDistShops[index].name;
            finalPath += ' {' + shopName + ' : ' + shopCoords + '} ->';
            finalCoords.push(minDistShops[index].coordinate);

            //getting actual final distance
            var currentCoords = minDistShops[index].coordinate;
            finalDist += geolib.getDistance(prevCoords, currentCoords);

            //updating previous coords
            prevCoords = currentCoords;
        }

        //dist back to home
        finalDist += geolib.getDistance(prevCoords, latlngHome);

        finalPath += 'H';
        console.log(finalPath);

        console.log("Final distance = " + finalDist);

        // Get center for all shops co-ordinates //
        /*
        for(var obj in path){
            var id = path[obj]._id;
            console.log(id);

            var dataObj = path[obj].data;

            for(var d in dataObj){
                var lat = dataObj[d].coordinate[0];
                var lng = dataObj[d].coordinate[1];

                lat_lng_arr.push([lat, lng]);
            }
        }
        console.log('lat_lng_arr : ');
        console.log(lat_lng_arr);

        response.dist = geolib.getCenter(lat_lng_arr);
        console.log(response.dist);
        */
        response.coords = finalCoords;

    }else{
        response.err = "Error while getting distance";
    }

    return response;
}

module.exports = DistanceCalculator;