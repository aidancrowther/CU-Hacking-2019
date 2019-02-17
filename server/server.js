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

        let userName = data.userName;

        players = {};
        players[userName] = client;

        client['userName'] = data.userName;
        client['location'] = data.location;
        
        let id = makeId();
        while(games[id]) id = makeId();
        
        games[id] = {
            'origin': data.location,
            'radius': data.radius,
            'startTime': new Date().getTime(),
            'players': players
        }

        client.join(id);
        client.emit('setup', id);
        client['gameID'] = id;

        io.to(id).emit('updateList', Object.keys(games[id]['players']));

        console.log(games);

    });

    client.on('joinGame', function(data){

        removeRooms(client);

        client.join(data.room);
        client['userName'] = data.userName;
        client['location'] = data.location;
        client['gameID'] = data.room;
        games[data.room]['players'][data.userName] = client;
        client.emit('joined');
        io.to(data.room).emit('updateList', Object.keys(games[data.room]['players']));

        console.log(games[data.room]['players']);

    });

    client.on('startGame', function(){

        console.log(client.userName);

        id = Object.keys(client.rooms)[0];
        io.to(id).emit('startGame');

        console.log(Object.keys(games[id].players));

        games[id].players = Object.keys(games[id].players)
        .map((key) => ({key, value: games[id].players[key]}))
        .sort((a, b) => b.key.localeCompare(a.key))
        .reduce((acc, e) => {
        acc[e.key] = e.value;
        return acc;
        }, {});

        console.log(Object.keys(games[id].players));

        broadcastHunters(games[id].players);

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

function determineDamage(id){

    let players = games[id].players;

    for(player in players){

    }

}

//Return whether or not a player is outside the boundary
function outsideRange(playerPos, origin, radius){
    var dist = getDist(playerPos, origin);
    return (dist > radius) ? true : false;
}

function updateGames(client){

    let id = client.gameID;

    if(games[id]){
        let playerList = Object.keys(games[id].players);
        let index = playerList.indexOf(client.userName);

        delete playerList[index];

    }

    if(typeof io.sockets.adapter.rooms[id] === 'undefined' && games[id]){
        clearInterval(games[id].loop);
        delete games[id];
    }
    else{
        if(id) io.to(id).emit('updateList', Object.keys(games[id]['players']));
    }

}

function broadcastHunters(players){

    let list = Object.keys(players);

    for(player in players){

        let index = list.indexOf(player);
        let target = index+1;
        let hunter = index-1;

        if(target >= list.length) target = 0;
        if(hunter < 0) hunter = list.length-1;

        data = {
            'targetname': list[target],
            'targetLoc': players[list[target]].location,
            'hunterName': list[hunter]
        }

        players[player].emit('huntData', data);
    }

}

function getDist(p1, p2){
    var distY = abs(p1[0] - p2[0]);
    var distX = abs(p1[1] - p2[1]);

    return Math.sqrt(distX**2 + distY**2);
}