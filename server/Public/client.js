let socket = io.connect('https://localhost:4000');


function goTo(destPage)
{
	$(".page").css("visibility", "hidden");
	$(destPage).css("visibility", "visible");
	
}

function createGame()
{
	
	let name = $('#newUsrName-createGame').val();
	let radius = getRadius();

	let data = {
		'userName': name,
		'location': pos,
		'radius': radius
	};
	socket.emit('createGame', data);

	goTo("#waitingRoom")
}

function joinGame()
{

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

function startGame()
{

	//TODO: write code to tell server that game is starting
	socket.emit('startGame');

}

function setUsrList(usrList)
{
	$("#usrList").empty();
	for(let index = 0; index < usrList.length; index++)
	{
		$("#usrList").append("<p>" + usrList[index] + "</p>")
	}
}

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

//Socket endpoint for receiving room code
socket.on('setup', function(data){

	alert(data);

	$("#roomCode").text(data);
	
	$("#startBtn").css("visibility", "visible");
	goTo("#waitingRoom");
	

});

//Socket endpoint for receiving lobby updates
socket.on('updateList', function(data){

	//data is an array containing all usernames of waiting users
	console.log(data);

	setUsrList(data);

});

//Socket endpoint for users to join a lobby
socket.on('joined', function(){

	goTo("#waitingRoom");

});

socket.on('startGame', function(){

	$("#startBtn").css("visibility", "inherit");
	goTo("#playGame");

});

socket.on('huntData', function(data){
	console.log(data);
	//set button to display name of your target
	document.getElementById('targetPerson').innerHTML = data.targetname;
	//set target circle to display on your target location
	targetCircle.setCenter({lat: data.targetLoc[0], lng: data.targetLoc[1]});
	
	
});

socket.on('alert', function(){
	alert('hit');
});




