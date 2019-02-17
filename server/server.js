const express = require('express');
const fs = require('fs');

let app = express();
let server = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);
let io = require('socket.io')(server);

let ROOT = './Public';
let PORT = 4000;

let games = {};

app.use('/', express.static('Public'));

io.on('connection', function(client) {
    
    client.on('createGame', function(data){

        removeRooms(client);

        client['userName'] = data.userName;
        client['location'] = data.location;
        
        let id = makeId();
        while(games[id]) id = makeId();
        
        games[id] = {
            'origin': [0, 0],
            'radius': data.radius,
            'startTime': new Date().getTime(),
            'players': [client['userName']]
        }

        client.join(id);
        client.emit('setup', id);
        client['gameID'] = id;

        console.log(games);

    });

    client.on('joinGame', function(data){

        removeRooms(client);

        client.join(data.room);
        client['userName'] = data.userName;
        client['location'] = data.location;
        client['gameID'] = data.room;
        games[data.room]['players'].push(client['userName']);
        client.emit('joined');
        io.to(data.room).emit('updateList', games[data.room]['players']);

        console.log(games[data.room]['players']);

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

        updateGames(client);

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

function updateGames(client){

    let id = client.gameID;

    if(games[id]){
        let playerList = games[id].players;
        let index = playerList.indexOf(client.userName);

        playerList.splice(index, 1);

    }


    if(typeof io.sockets.adapter.rooms[id] === 'undefined' && games[id]){
        clearInterval(games[id].loop);
        delete games[id];
    }
    else{
        if(id) io.to(id).emit('updateList', games[id]['players']);
    }

}

function getList(){

    for(game in games){
        console.log(io.sockets.adapter.rooms[game].sockets);
    }

}