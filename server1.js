// written by Caleb Rivera

const http = require('http');
const fs = require('fs');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
var ably = new require('ably').Realtime('ug5isA._li3Cw:2GTzt_IvptxXrFnudQsXYzoJGtkgL59pSjjx2CRSqUk');
var channel = ably.channels.get('HE');
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'hemessagespace', autoload: true });

// const options = {
//     key: fs.readFileSync('private.key'),
//     cert: fs.readFileSync('certificate.crt')
// }

app.use(express.static("express"));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/express/main.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname+'/express/login.html'));
});

app.post('/pollsend', async function(req, res){
    console.log(req.body.flavorz)
    
    // Find if document exists
    db.find({ name: req.body.flavorz}, function (err, docs){
        console.log(docs)
        console.log(docs.length)
        if (docs.length == 0){
            console.log("Not Found")
        }else{
            console.log("Found")
        }
    });

    var doc = { name: req.body.flavorz, number: 5 };
 
    db.insert(doc, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
    });
    db.find({}, function (err, docs) {
        // If no document is found, docs is equal to []
        console.log(docs)
    });
    channel.publish('primary', req.body.flavorz);
    res.status = 202;
    res.redirect('/submitted')
    res.end();
});

app.get('/submitted', (req, res) => {
    res.sendFile(path.join(__dirname+'/express/main.html'));
  });

const server = http.createServer(app);
//const hostname = '127.0.0.1';
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);

// Read file function
fs.readFile('readme2.txt', 'utf8' , (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    var array1 = data.toString().split("\n");
    var array2 = []
    for(i in array1){
        var topush = array1[i].split(",")
        array2.push(topush)
    }
    firststep(array2)
})

// Sort message space and (more?)
function firststep(content){
    content.sort(sortmessagespace)
    console.log(content)
}

// Sort function
function sortmessagespace(a, b) {
    return a[1] - b[1];
}