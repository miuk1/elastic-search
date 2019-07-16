const elasticSearch = require('elasticsearch');
const client = new elasticSearch.Client({
    hosts: ['http://localhost:9200']
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// ping the client to be sure Elasticsearch is up
client.ping({
    requestTimeout: 30000,
}, function(error) {
// at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//enable cors
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// defined the base route and return with an HTML file called tempate.html
app.get('/', function(req, res){
    res.sendFile('template.html', {
       root: path.join( __dirname, 'views' )
     });
  });

//define /search route that should return elastic search results
app.get('/search', (req, res, next)=>{
    let body={
        size: 200,
        from: 0,
        query: {
            match: {
                name: req.query['q']
            }
        }
    }

    client.search({index: 'scotch.io-tutorial', body:body, type: 'cities_list'})
    .then(results => res.send(results.hits.hits))
    .catch(err=>{
        console.log(err);
        res.send([]);
    });
});


app.set('port', process.env.PORT || 3001);
app.listen(app.get('port',function(){
    console.log('Express server listening on port: ', app.get('port'));
}));



