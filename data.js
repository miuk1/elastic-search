const elasticSearch = require("elasticsearch");
//instantiate an ElasticSearch Client
const client = new elasticSearch.Client({
    hosts: ['http://localhost:9200']
});

//ping the client to be sure ElasticSearch is up
client.ping({
    requestTimeout: 30000,
}, (err)=>{
    if(err){
        console.log('ElasticSearch cluster is down!');
    }else{
        console.log('Everything is alright');
    }
});

//create a new index. if index is already defined, this fails safely
client.indices.create({
    index: 'scotch.io-tutorial'
}, (err, res, status)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Created a new index', res);
    }
});

//add data to the index that has already been created
client.index({
    index: 'scotch.io-tutorial',
    id: '1',
    type: 'client-list',
    body: {
        "Key1": "Content for key1",
        "Key2": "Content for key2",
        "Key3": "Content for key3"
    }
}, (err,res, status)=>{
    console.log(res);
});

//require the array of cities
const cities = require('./cities.json');
//declare an empty bulk array
let bulk = [];

cities.forEach(city => {
    bulk.push({
        index: {
            _index: "scotch.io-tutorial",
            _type: "cities_list",
        }
    });
    bulk.push(city);
});

//perform bulk indexing of the data passed
client.bulk({body:bulk}, (err, res)=>{
    if(err){
        console.log("Failed bulked operation".red,err);
    }else{
        console.log("Successfully imported %s".green,cities.length);
    }
})