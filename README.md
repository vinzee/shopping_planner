# Shopping Planner using TSP
Shopping Planner using TSP.

### Installing NodeJS
```sh
$ sudo apt-get install nodejs
$ sudo apt-get install npm
$ sudo apt-get install build-essential
```

### Start the mongo daemon
```sh
$ sudo mongod --dbpath=/var/lib/mongodb
```

### Starting the app
```sh
$ npm install
$ bower install
$ sudo npm install -g yo grunt grunt-cli bower
$ sudo npm install -g express-generator express-mongoose-generator generator-bootstrap generator-mongoose
$ sudo npm install geolib
$ npm start
$ Goto - http://localhost:3000
```

### Building application
Install dependencies <br>
``
$ bower install <package-name>
`` <br>
Add required dependencies from existing code <br>
``
$ bower install
`` <br>

### One time setup per project
```
https://expressjs.com/en/starter/generator.html
```

### Scaffold Generator
* generator-api - https://github.com/ndelvalle/generator-api
* generator-mongoose - https://www.npmjs.com/package/generator-mongoose
* express-mongoose-generator - https://www.npmjs.com/package/express-mongoose-generator
	Model Generator


```sh
yo mongoose:schema "shop|name:String,type:String,category:String,subcategory:String,coordinates:Array,city:String,country:String,address:String,postcode:String,owner:String,phone:String"
yo mongoose:schema "product|name:String,type:String"
```
### Software
* Git - https://git-scm.com/downloads
* Webstorm - https://www.jetbrains.com/webstorm/download/

### Important Links -
* mongo Geonear radius - https://docs.mongodb.com/v3.2/reference/command/geoNear/
* Select2 - https://select2.github.io/examples.html
* Geolib - https://www.npmjs.com/package/geolib
* bootstrap notify - http://goodybag.github.io/bootstrap-notify/
* bower setup - https://www.digitalocean.com/community/tutorials/how-to-manage-front-end-javascript-and-css-dependencies-with-bower-on-ubuntu-14-04
* express-generator - https://www.npmjs.com/package/express-generator
	Express App generator
* What is yeoman ? - http://yeoman.io/learning/index.html
	Collection of Generators
* Grunt - https://scotch.io/tutorials/a-simple-guide-to-getting-started-with-grunt
	Task Runner
* Morgan - https://www.npmjs.com/package/morgan
	Logger
* Dillinger - http://dillinger.io
	MD file online editor
* NodeJS REPL - http://stackoverflow.com/questions/14549846/equivalence-of-rails-console-for-node-js
	Read Eval Print Loop
* Bluebird - http://bluebirdjs.com/docs/getting-started.html
	Promises