var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Shop', function(){
  it('creates new shop and responds with json success message', function(done){
    request(app)
    .post('/api/shop')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"shop": {&#34;name&#34;:&#34;When the Castilian royal standard-bearer fell, the already demoralized troops on the rear thought their King was dead and started to flee in panic; in a matter of moments this became a general rout where Juan of Castile himself had to run at full speed to save his life, leaving behind not only common soldiers but also many still dismounted noblemen.&#34;,&#34;type&#34;:&#34;Paul Westhead decided to start Johnson at center in Game 6; Johnson recorded 42 points, 15 rebounds, 7 assists, and 3 steals in a 123–107 win, while playing guard, forward, and center at different times during the game.&#34;,&#34;category&#34;:&#34;The role involved him in the direction of over 70 Commonwealth and European squadrons in operations against Germany, and was \&#34;unique\&#34; for an RAAF officer during the war.&#34;,&#34;subcategory&#34;:&#34;Across Madagascar, people distinguish two kinds of fossa—a large fosa mainty (\&#34;black fossa\&#34;) and the smaller fosa mena (\&#34;reddish fossa\&#34;)—and a white form has been reported in the southwest.&#34;,&#34;coordinates&#34;:[&#34;The black population of Vancouver is rather scant in comparison to other Canadian major cities, making up 0.&#34;,&#34;After mating, he raises his head and back and whistles.&#34;],&#34;city&#34;:&#34;The most common grains were rye, barley, buckwheat, millet, and oats.&#34;,&#34;country&#34;:&#34;The room above has a particularly fine plaster ceiling and chimneypiece of stucco caryatids and panelling interlaced with studded bands sprouting into large flowers.&#34;,&#34;address&#34;:&#34;Today the Chinese are the largest visible ethnic group in the city, with a diverse Chinese-speaking community, and several languages, including Cantonese and Mandarin.&#34;,&#34;postcode&#34;:&#34;After announcing his infection in November 1991, Johnson created the Magic Johnson Foundation to help combat HIV, although he later diversified the foundation to include other charitable goals.&#34;,&#34;owner&#34;:&#34;The cartouches over staircases one, two, three, five and six and the chapel, bar and provost&#39;s lodgings entrances bear the arms of important figures in the College&#39;s history; (1) Anthony Blencowe (Provost 1574-1618) who left money that paid for building the west side of front quad.&#34;,&#34;phone&#34;:&#34;Beginning in the 1980s, a new set of scholarly editions have been printed under the series title \&#34;The Anglo-Saxon Chronicle: A Collaborative Edition\&#34;.&#34;}})
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

describe('GET List of Shops', function(){
  it('responds with a list of shop items in JSON', function(done){
    request(app)
    .get('/api/shops')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Shop by ID', function(){
  it('responds with a single shop item in JSON', function(done){
    request(app)
    .get('/api/shop/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Shop by ID', function(){
  it('updates shop item in return JSON', function(done){
    request(app)
    .put('/api/shop/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "shop": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Shop by ID', function(){
  it('should delete shop and return 200 status code', function(done){
    request(app)
    .del('/api/shop/'+ _id) 
    .expect(204, done);
  });
});