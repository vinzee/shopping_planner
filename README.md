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
$ sudo npm install -g yo express-generator express-mongoose-generator generator-bootstrap generator-mongoose grunt
$ npm start
$ Goto - http://localhost:3000
```

### Scaffold Generator
* generator-api - https://github.com/ndelvalle/generator-api
* generator-mongoose - https://www.npmjs.com/package/generator-mongoose


```sh
yo mongoose:schema "shop|name:String,type:String,category:String,subcategory:String,coordinates:Array,city:String,country:String,address:String,postcode:String,owner:String,phone:String"
yo mongoose:schema "product|name:String,type:String"
```

### Important Links -
* express-generator - https://www.npmjs.com/package/express-generator
	Express App generator
* What is yeoman ? - http://yeoman.io/learning/index.html
	Collection of Generators
* express-mongoose-generator - https://www.npmjs.com/package/express-mongoose-generator
	Model Generator
* Grunt - https://scotch.io/tutorials/a-simple-guide-to-getting-started-with-grunt
	Task Runner
* Morgan - https://www.npmjs.com/package/morgan
	Logger
* Dillinger - http://dillinger.io
	MD file online editor
* NodeJS REPL - http://stackoverflow.com/questions/14549846/equivalence-of-rails-console-for-node-js