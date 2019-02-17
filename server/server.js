const express = require('express');
const fs = require('fs');

let app = express();
let server = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);
//let server = require('http').createServer(app);
let io = require('socket.io')(server);

let ROOT = './Public';
let PORT = 4000;

const hunterDmgDist = 4; //min distance for hunter to deal damage to target
const hunterDmg = 10; //damage dealt by a nearby hunter
const OOBdmg = 5; //damage taken when out of bounds
const startingHp = 100;


let games = {};

app.get('/', function(req, res){
   res.sendfile(ROOT+'/game.html');
});

app.use('/', express.static('Public'));

io.on('connection', function(client) {
    
    client.on('createGame', function(data){

        removeRooms(client);

        let userName = data.userName;

        players = {};
        players[userName] = client;

        client['userName'] = data.userName;
        client['location'] = data.location;
        client["hp"] = startingHp;
        client['kills'] = 0;
        client["timeOutOfBounds"] = 0;
        
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

        if(!games[data.room]) return;

        removeRooms(client);

        client.join(data.room);
        client['userName'] = data.userName;
        client['location'] = data.location;
        client['gameID'] = data.room;
        client["hp"] = startingHp;
        client['kills'] = 0;
        client["timeOutOfBounds"] = 0;
        games[data.room]['players'][data.userName] = client;
        client.emit('joined');
        io.to(data.room).emit('updateList', Object.keys(games[data.room]['players']));

    });

    client.on('startGame', function(){

        id = Object.keys(client.rooms)[0];
        let data = {
            'location': games[id].origin,
            'radius': games[id].radius
        }
        io.to(id).emit('startGame', data);

        games[id].players = Object.keys(games[id].players)
        .map((key) => ({key, value: games[id].players[key]}))
        .sort((a, b) => b.key.localeCompare(a.key))
        .reduce((acc, e) => {
        acc[e.key] = e.value;
        return acc;
        }, {});

        broadcastHunters(games[id].players);

        setTimeout(() => {
            games[id]['loop'] = setInterval(gameLoop, 1000, id);
        }, 10000);

    });

    client.on('updatePos', function(data){

        if(client.userName){
            client['location'] = data;
        }

    });

    client.on('disconnect', function(){

        updateGames(client);

    });

    client.on('die', function(){

        let id = client.gameID;
        let players = games[id].players;
        let list = Object.keys(players);
        let index = list.indexOf(client.userName);

        let hunter = list[(index+list.length-1)%list.length];

        console.log(games[id]['players'][hunter].kills);

        games[id]['players'][hunter]['kills'] += 1;

        players[list[index]]

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

    determineDamage(id);
    updatePlayers(id);
    broadcastHunters(games[id].players);
    checkGameOver(id);

}

//check if the game has reached an end condition
//if so: determine a winner and announce it to all players
//then end the game loop
//endif
function checkGameOver(){
    let players = games[id].players;
    let list = Object.keys(players);
    let data;
    if(list.length == 1){
        data = players[list[0]][userName];
    }else if(list.length == 2){
        let p1 = players[list[0]];
        let p2 = players[list[1]];
        if(p1.hp > p2.hp || p1.kills > p2.kills){//p1 wins
            data = p1.userName;
        }else{//p2 wins
            data = p2.userName;
        }
    } else if(list.length == 0){
        data = "NOBODY!!";
    }
    else return;
    
    io.to(id).emit("endGame", data);
}

// check if each player in a game should be taking damage
// either by their hunter or being outside the zone
function determineDamage(id){

    let players = games[id].players;
    let list = Object.keys(players);

    for(let playerKey in players){
        let player = players[playerKey];
        let playerIndex = list.indexOf(playerKey);
        let hunter = list[(playerIndex+list.length-1)%list.length];
        
        //damage from hunter
        if(!outsideRange(player["location"], players[hunter]["location"], hunterDmgDist))
            takeDmg(player, hunterDmg);
        
        //out-if-bounds damage
        if(outsideRange(player["location"], games[id]["origin"], games[id].radius)){
            if(player["timeOutOfBounds"]++ > 10)
            {
                takeDmg(player, OOBdmg)
            }
            
        } else {
            player["timeOutOfBounds"] = 0;
        }
    }

}

function updatePlayers(id){

    let players = games[id].players;

    for(let player in players){
        players[player].emit('updatePlayers', players[player].hp);
    }

}

function takeDmg(playr, dmg)
{
    playr["hp"] -= dmg;
}

//Return whether or not a player is outside the boundary
function outsideRange(playerPos, origin, radius){
    var dist = getDist(playerPos, origin);
    return (dist > radius) ? true : false;
}

function updateGames(client){

    let id = client.gameID;

    if(games[id]){
        console.log(client.userName);
        delete games[id]['players'][client.userName];
    }

    if(typeof io.sockets.adapter.rooms[id] === 'undefined' && games[id]){
        clearInterval(games[id].loop);
        delete games[id];
    } else {
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
    return measure(p1[0], p1[1], p2[0], p2[1]);
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}
