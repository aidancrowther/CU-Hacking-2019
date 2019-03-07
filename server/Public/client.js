let socket = io.connect(window.location.origin);
let numPlayers = 0;
let getPosLoop;
let saveData = false;// user has given permission to anonymously store location information

//change which html page is visible to the user
function goTo(destPage){
	$(".page").css("visibility", "hidden");
	$(destPage).css("visibility", "visible");
}

//sets whether or not user has given permission to store location info
function permission(given, cookie){
	if(!given){
		saveData = false;
		console.log("Data: not saved\n" + "Cookies: " + (cookie ? "yes" : "no"));
		return;
	}
	
	saveData = true;
	
	console.log("Data: saved\n" + "Cookies: " + (cookie ? "yes" : "no"));
	
	if(!cookie) return;
	//store a cookie for future reference
	//TODO: store a cookie saying that we can always store location information from this client
}

//sends the client's mane, position and selected radius to the server
function createGame(){
	
	let name = $('#newUsrName-createGame').val();
	let delay = parseInt($("#newTimeDelay-createGame").val(), 10)*1000;
	let radius = getRadius();

	let data = {
		'userName': name,
		'location': pos,
		'startDelay': delay,
		'radius': radius,
		"saveData": saveData
	};
	
	console.log('Info sent at creation:');
	console.log(data);
	
	socket.emit('createGame', data);
}

//allows a player to join a game by the room code they provide
function joinGame(){

	let room = $('#joinGameCodeTxt').val();
	let name = $('#newUsrName-joinGame').val();

	let data = {
		'userName': name,
		'location': pos,
		'room': room
	};
	socket.emit('joinGame', data);

	$("#roomCode").text(room);
}

//notifies the server that the game is ready to be started
function startGame(){
	socket.emit('startGame');
}

//update list of players in-game
function setUsrList(usrList){
	$("#usrList").empty();
	for(let index = 0; index < usrList.length; index++)
	{
		$("#usrList").append("<p>" + usrList[index] + "</p>")
	}
}

//display a timer that runs for the specified time
function startTimer(milliseconds, nextPage){
	let endTime = new Date().getTime() + milliseconds; //time when function ends (ms)
	
	//refresh timer every 0.1 seconds
	let countdownLoop = setInterval(function(){
		let currTime = endTime - new Date().getTime(); //time until function ends (ms)
		$("#timerDisplay").text((currTime/1000).toFixed(1)); //refresh timer
	}, 100);
	
	//end timer and go to nextPage
	setTimeout(()=>{
		clearInterval(countdownLoop);
		goTo(nextPage);
	}, milliseconds);
	
	goTo("#countdownPage")
}

//returns the selected radius, converted into meters
function getRadius(){

	let radius = parseInt($('#newRadiusTxt').val(), 10);
	let units = $('#distanceUnitMenu').val();

	switch(units){

		case('kilometers'):
			radius = radius * 1000;
		break;

		case('feet'):
			radius = radius*0.3048;
		break;

		case('miles'):
			radius = radius*1609.34;
		break;

	}

	radius = Math.floor(radius);
	return radius;

}

//notifies the server that the player's health is <= 0 and removes that player from the game
function die(){
	goTo("#deathPage");
	clearInterval(getPosLoop);
	socket.emit("die");
}

//Socket endpoint for receiving room code
socket.on('setup', function(data){

	$("#roomCode").text(data);
	
	$("#startBtn").css("visibility", "visible");
	goTo("#waitingRoom");
	

});

//Socket endpoint for receiving lobby updates
socket.on('updateList', function(data){

	//data is an array containing all usernames of waiting users
	console.log(data);
	
	numPlayers = data.length;
	
	if (numPlayers >= 3) {
		//$('#startBtn').css('disabled', 'false');
		document.getElementById('startBtn').disabled = false;
	}
	else {
		//$('#startBtn').css('disabled', 'true');
		document.getElementById('startBtn').disabled = true;
	}

	document.getElementById('stillAlive').innerHTML = "Alive: " + numPlayers;
	document.getElementById('playersJoined').innerHTML = "Players in Lobby: " + numPlayers;

	setUsrList(data);

});

//Socket endpoint for users to join a lobby
socket.on('joined', function(){

	goTo("#waitingRoom");

});

//socket endpoint for a game to be started
socket.on('startGame', function(data){

	let delay = data.delay;

	startTimer(delay, "#playGame");
	
	getPosLoop = setInterval(getPos, 2000);
	$("#startBtn").css("visibility", "inherit");
	
	map.setCenter({lat: data.location[0], lng: data.location[1]});
	deathCircle.setCenter({lat: data.location[0], lng: data.location[1]});
	deathCircle.setRadius(data.radius);

});

//socket endpoint for receiving game state info
socket.on('huntData', function(data){
	console.log(data);
	//set button to display name of your target
	document.getElementById('targetPerson').innerHTML = data.targetname;
	//set target circle to display on your target location
	targetCircle.setCenter({lat: data.targetLoc[0], lng: data.targetLoc[1]});
});

//socket endpoint for receiving updated hp amount
socket.on("updatePlayers", function(data){
	
	if(data <= 0){
		die();
	}
	$("#healthDisplay").text("HP: " + data);

});

//socket endpoint for the game ending
socket.on("endGame", function(data){
	$("#winnerName").text(data);
	
	goTo("#winnerPage")
});

socket.on('alert', function(){
	alert('hit');
});




