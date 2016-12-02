// https://github.com/sunng87/node-geohash

var geohash = require('ngeohash');
var hashstring = geohash.encode(37.8324, 112.5584, 22);
var hashstring1 = geohash.encode(39.929583,-74.268951, 22);
var hashstring2 = geohash.encode(39.869531,-74.300537, 22);
var hashstring3 = geohash.encode(37.2610711,-74.6987070, 22);
// var hashstring2 = geohash.encode(37.8324, 112.5584, 25);
// var hashstring3 = geohash.encode(37.8324, 112.5584, 25);
// var hashstring4 = geohash.encode(37.8324, 112.5584, 25);
// console.log("hashstring - ", hashstring); // prints ww8p1r4t8
console.log("hashstring1 - ", hashstring1);
console.log("hashstring2 - ", hashstring2);
// console.log("hashstring3 - ", hashstring3);

var latlon = geohash.decode('ww8p1r4t8');
console.log(latlon.latitude, " - ", latlon.longitude);

// var decoded_bbox = geohash.decode_bbox ('ww8p1r4t8');
// console.log("decoded_bbox - ", decoded_bbox);

var neighbors = geohash.neighbors(hashstring);
console.log("neighbors - ", neighbors);

