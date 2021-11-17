const http = require('http');
const fs = require('fs');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const path = require('path');

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