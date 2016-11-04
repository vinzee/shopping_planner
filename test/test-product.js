var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Product', function(){
  it('creates new product and responds with json success message', function(done){
    request(app)
    .post('/api/product')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"product": {&#34;name&#34;:&#34;James was invested with the Order of the Garter in 1642, and created Duke of York on 22 January 1644.&#34;,&#34;type&#34;:&#34;Fort Orange, 240 kilometres (150 mi) north on the Hudson River, was renamed Albany after James&#39;s Scottish title.&#34;}})
    .expect(201)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      _id = res.body._id;
      done();
    });
  });
});

describe('GET List of Products', function(){
  it('responds with a list of product items in JSON', function(done){
    request(app)
    .get('/api/products')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Product by ID', function(){
  it('responds with a single product item in JSON', function(done){
    request(app)
    .get('/api/product/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Product by ID', function(){
  it('updates product item in return JSON', function(done){
    request(app)
    .put('/api/product/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "product": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Product by ID', function(){
  it('should delete product and return 200 status code', function(done){
    request(app)
    .del('/api/product/'+ _id) 
    .expect(204, done);
  });
});