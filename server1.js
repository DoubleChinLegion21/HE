const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt')
}

app.use(express.static("express"));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'))

app.get('/main', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname+'/express/main.html'));
});

const server = https.createServer(options, app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
