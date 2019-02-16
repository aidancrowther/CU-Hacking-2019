const express = require('express');

let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let ROOT = './Public';
let PORT = 4000;

let games = {};

app.use(express.static('interface'));

//respond to request for index.html
app.get('/', function(req, res){
    res.sendfile( ROOT + '/index.html');
});

io.on('connection', function(client) {
    
    client.on('createGame', function(){
        
        let id = makeId();
        while(games[id]) id = makeId();
        
        games[id] = {
            'origin': [0, 0],
            'radius': 10,
            'startTime': new Date().getMinutes()
        }

        client.join(id);
        client.emit('setup', id);
    });
});

//listen for requests on port 4000
server.listen(PORT, function(err){if(err) console.log(err)});

//Helpers go here
function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}