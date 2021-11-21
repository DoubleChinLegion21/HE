// written by Caleb Rivera

const http = require('http');
const fs = require('fs');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const internal = require('stream');
var ably = new require('ably').Realtime('ug5isA._li3Cw:2GTzt_IvptxXrFnudQsXYzoJGtkgL59pSjjx2CRSqUk');
var channel = ably.channels.get('HE');
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'hemessagespace4', autoload: true }), db_s = new Datastore({ filename: 'settings', autoload: true });

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
app.get('/admin', (req, res) => {
    const reject = () => {
      res.setHeader('www-authenticate', 'Basic')
      res.sendStatus(401)
    }
  
    const authorization = req.headers.authorization
  
    if(!authorization) {
      return reject()
    }
  
    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')
  
    if(! (username === 'admin' && password === 'hehehe')) {
      return reject()
    }
  
    res.sendFile(path.join(__dirname+'/express/admin476.html'));
  })

app.post('/pollsend', async function(req, res){
    console.log(req.body.flavorz)
    if (req.body.flavorz != "x") {
    // Find if document exists
    db.find({ name: req.body.flavorz}, function (err, docs){
        if (docs.length == 0){
            console.log("Not Found")
            var doc = { name: req.body.flavorz, number: 1 };
            db.insert(doc, function (err, newDoc) {   // Callback is optional
            // newDoc is the newly inserted document, including its _id
            // newDoc has no key called notToBeSaved since its value was undefined
                get_and_send_results()
            });
        }else{
            console.log("Found")
            console.log(docs[0]._id)
            db.update({ _id: docs[0]._id }, { $set: { number: docs[0].number+1 } }, function (err, numReplaced) {
                get_and_send_results()
            });
        }
    });
    }
    //res.sendStatus(202)
    res.redirect('/submitted')
    res.end();
    
});
function get_and_send_results(){
    db.find({}, function (err, docs) {
        console.log(docs)
        db_s.find({ name: "phase"}, function (err, the_doc){
            var to_send = [docs, the_doc[0].password]
            channel.publish('primary', to_send);});
    });
}

app.get('/submitted', (req, res) => {
    res.sendFile(path.join(__dirname+'/express/main.html'));
});

app.get('/whatphase', (req, res) => {
    db_s.find({ name: "phase"}, function (err, docs){
        res.send(String(docs[0].phase))
    });
})

app.get('/whatbase', (req, res) => {
    db.find({}, function (err, docs){
        db_s.find({ name: "phase"}, function (err, the_doc){
            console.log(the_doc)
            var to_send = [docs, the_doc[0].password]
            res.send(to_send)
        });
    });
})

app.post('/attempt_login', (req, res) => {
    console.log(req.body.key)
    var to_send = []
    db_s.find({ name: "phase" }, function (err, doc){
        // Check if key is less than ctext
        var ctext = doc[0].ciphertext
        if (req.body.key.length < ctext.length){
            to_send = [false, "Key is shorter than ciphertext"]
            res.send(to_send)
        } else {
            var seed = "";
                for (j in ctext) {
                    seed = seed + String.fromCharCode(ctext[j].charCodeAt(0) ^ req.body.key[j].charCodeAt(0));
                }
            console.log(seed)
            //locate seed in seedspace
            db.find({}, function (error, docs){
                docs.sort(sortmessagespace2)
                var total = -1
                var found = false
                var nammm = "Seed out of bounds"
                var honeykey = false
                for (i in docs){
                    if (docs[i].number + total >= Number(seed)){
                        console.log("found at", docs[i].name)
                        nammm = docs[i].name
                        found = true
                        console.log(nammm)
                        if (nammm != doc[0].message){
                            honeykey = true
                        }
                        break
                    }
                    total += docs[i].number
                }
                if (found == false){
                    console.log("not found, randomizing")
                    var seed = getRandomInt(0, total)
                    total = -1
                    for (i in docs){
                        if (docs[i].number + total >= Number(seed)){
                            console.log("found at", docs[i].name)
                            nammm = docs[i].name
                            break
                        }
                        total += docs[i].number
                    }
                }
                to_send = [found, nammm, honeykey]
                res.send(to_send)
            });
        }
    });
})

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
function sortmessagespace2(a,b){
    if (a.number == b.number){
        if(a.name > b.name) { return 1; }
        if(a.name < b.name) { return -1; }
        return 0;
    }else{
        return a.number - b.number;
    }
}

function generate_seedspace(){
    db.find({}, function (err, docs) {
        docs.sort(sortmessagespace2)
    });
}

channel.subscribe('generate', function(message) {
    generate_seedspace()
});

// If phase setting document doesn't exist, make it
db_s.find({ name: "phase"}, function (err, docs){
    if (docs.length == 0){
        var doc = { name: "phase", phase: 1 , password: 0, message: 0, seed: -1};
        db_s.insert(doc, function (err, newDoc) {   // Callback is optional
            //do something
        });
    }
});
channel.subscribe('phase', function(message){
    db_s.find({ name: "phase"}, function (err, docs){
        db_s.update({ _id: docs[0]._id }, { $set: { phase: message.data } }, function (err, numReplaced) {
            //do something
            // More like do nothing, because the server now has the most accurate setting
        });
    });
});

channel.subscribe('wash', function(message){
    db.remove({ }, { multi: true }, function (err, numRemoved) {
        db_s.find({ name: "phase"}, function (err, docs){
        db_s.update({ _id: docs[0]._id }, { $set: { phase: 1, password: 0, message: 0, seed: -1} }, function (err, numReplaced) {
            //do something
            // More like do nothing, because the server now has the most accurate setting
            console.log("washed")
            get_and_send_results()
        });
        });
    });
})

channel.subscribe('setpassword', function(message){
    console.log(message.data)
    db_s.find({ name: "phase"}, function (err, docs){
        db_s.update({ _id: docs[0]._id }, { $set: { password: message.data } }, function (err, numReplaced) {
            //do something
            // More like do nothing, because the server now has the most accurate setting
            send_out_seed_pwrd()
        });
    });
});

// get random number in range
function getRandomInt(min, max) {
    console.log(min,max)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is exclusive and the minimum is inclusive
}

channel.subscribe('setmessage', function(message){
    console.log(message.data)
    db_s.find({ name: "phase"}, function (err, docs){

        db.find({}, function (err, sorted_docs) {
            sorted_docs.sort(sortmessagespace2)
            var total = -1
            var current_pos = 0
            var seed = ""
            var new_total = -1
            // generate ciphertexts
            for (i in sorted_docs){
                current_pos = i
                if (sorted_docs[i].name != message.data) {
                    total = new_total + 1

                    var new_total = total + sorted_docs[current_pos].number - 1
                    // make seed and turn it into a string padded by zeros
                    seed = getRandomInt(total, new_total)
                }else{
                    break
                }
            }
            total = new_total + 1
            var new_total = total + sorted_docs[current_pos].number - 1
            // make seed and turn it into a string padded by zeros
            seed = getRandomInt(total, new_total)
            seed = String(seed).padStart(String(docs[0].password).length, "0");
            // Find Ciphertext
            var ciphertext = "";
            for (j in docs[0].password) {
                ciphertext = ciphertext + String.fromCharCode(docs[0].password[j].charCodeAt(0) ^ seed[j].charCodeAt(0));
            }
            db_s.update({ _id: docs[0]._id }, { $set: { message: message.data, seed: seed, ciphertext: ciphertext} }, function (err, numReplaced) {});

            // generate alt_passwords
            var total = -1
            var current_pos = 0
            var new_total = -1
            for (i in sorted_docs){
                current_pos = i
                total = new_total + 1

                new_total = total + sorted_docs[current_pos].number - 1
                // make seed and turn it into a string padded by zeros
                var seed = getRandomInt(total, new_total)
                seed = String(seed).padStart(String(docs[0].password).length, "0");

                // find alt_password
                var alt_password = "";
                for (j in docs[0].password){
                    alt_password = alt_password + String.fromCharCode(ciphertext[j].charCodeAt(0) ^ seed[j].charCodeAt(0));
                }
                db.update({ name: sorted_docs[i].name }, { $set: { seed: seed, alt_password: alt_password} }, function (err, numReplaced) {});
                           
            }
            send_out_seed_pwrd()
        });
    });
});

function send_out_seed_pwrd(){
    db_s.find({ name: "phase"}, function (err, docs){
        var to_send = [docs[0].password, docs[0].message, docs[0].seed]
        channel.publish('set_seed_password', to_send)
        console.log(docs)
        get_and_send_results()
    })
    db.find({}, function (err, docs){
        console.log(docs)
    })
}