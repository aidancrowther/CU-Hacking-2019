const express = require('express');

let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let ROOT = './Public';
let PORT = 4000;

let games = {};

app.use('/', express.static('Public'));

io.on('connection', function(client) {
    
    client.on('createGame', function(data){

        removeRooms(client);
        
        let id = makeId();
        while(games[id]) id = makeId();
        
        games[id] = {
            'origin': [0, 0],
            'radius': 10,
            'startTime': new Date().getTime()
        }

        client.join(id);
        client.emit('setup', id);
        client['userName'] = 'test';

        console.log(client.userName);
    });

    client.on('joinGame', function(data){

        removeRooms(client);

        client.join(data.room);
        io.to(data.room).emit("alert");

        console.log(io.sockets.adapter.rooms[data.room].sockets);

    });

    client.on('startGame', function(){

        console.log(client.userName);

        id = Object.keys(client.rooms)[0];
        io.to(id).emit('alert');
        games[id]['loop'] = setInterval(gameLoop, 2000, id);

    });

    client.on('updatePos', function(data){

        client['location'] = data.location;

    });

    client.on('disconnect', function(){

        updateGames();

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

function removeRooms(client){

    for (room in client.rooms){
        client.leave(room);
    }

}

function gameLoop(id){

    console.log(id);

}

function updateGames(){

    for(game in games){
        if(typeof io.sockets.adapter.rooms[game] === 'undefined'){
            clearInterval(games[game].loop);
            delete games[game];
        }
    }

}

function getList(){

    for(game in games){
        console.log(io.sockets.adapter.rooms[game].sockets);
    }

}