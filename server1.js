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

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname+'/express/main.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname+'/express/login.html'));
});

const server = http.createServer(app);
//const hostname = '127.0.0.1';
const port = 80;
server.listen(port);
console.debug('Server listening on port ' + port);

