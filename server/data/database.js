var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/graphqltest';
var pmongo = require('promised-mongo');
const db = pmongo(url);
const featuresCollection = db.collection('features')


class User {
  constructor(id, name, username, website) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.website = website;
  }
}

class Search {
  constructor(id,searchTerm){
    this.id = id;
    this.searchTerm = searchTerm;
  }
}

class Feature {
  constructor(id, name, description, url) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
  }
}

class Result {
  constructor(id, name, price, url){
    this.id = id;
    this.name = name;
    this.price = price;
    this.url = url;
  }
}

const basicSearch = new Search('1','test term');
const lvarayut = new User('1', 'Varayut Lerdkanlayanawat', 'lvarayut', 'https://github.com/lvarayut/relay-fullstack');
const features = [
  new Feature('1', 'React', 'A JavaScript library for building user interfaces.', 'https://facebook.github.io/react'),
  new Feature('2', 'Relay', 'A JavaScript framework for building data-driven react applications.', 'https://facebook.github.io/relay'),
  new Feature('3', 'GraphQL', 'A reference implementation of GraphQL for JavaScript.', 'http://graphql.org'),
  new Feature('4', 'Express', 'Fast, unopinionated, minimalist web framework for Node.js.', 'http://expressjs.com'),
  new Feature('5', 'Webpack', 'Webpack is a module bundler that packs modules for the browser.', 'https://webpack.github.io'),
  new Feature('6', 'Babel', 'Babel is a JavaScript compiler. Use next generation JavaScript, today.', 'https://babeljs.io'),
  new Feature('7', 'PostCSS', 'PostCSS. A tool for transforming CSS with JavaScript.', 'http://postcss.org'),
  new Feature('8', 'MDL', 'Material Design Lite lets you add a Material Design to your websites.', 'http://www.getmdl.io')
];


function getResult(id){
  return featuresCollection.findOne({"_id":ObjectId(id)}).then();
}

function getResults(searchStr){
	var q = (searchStr) ? {"search_term":searchStr} : {"search_term":"default for no results"};
	console.log(q);
	var promise= featuresCollection.find(q).toArray().then(function(docs){
		var newResults = [];
	  for(var i = 0;i< docs.length; i++){
		  var str = docs[i].search_term;
	    const resultConvert = new Result(docs[i]._id.toString(),
					     str,
					     docs[i].price[0]+docs[i].price[1], 
					     docs[i].url);
	    newResults.push(resultConvert);
	  }
	  return newResults;
  });
  return promise;
}

function getSearch(id){
	console.log(id);
	console.log(basicSearch)
  return basicSearch
}

function getUser(id) {
  return id === lvarayut.id ? lvarayut : null;
}

function getFeature(id) {
  return features.find(w => w.id === id);
}

function getFeatures() {
  return features;
}

export {
  User,
  Feature,
  Result,
  Search,
  getResult,
  getSearch,
  getResults,
  getUser,
  getFeature,
  getFeatures
};
