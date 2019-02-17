let hostUsr = false;

function goTo(destPage)
{
	$(".page").css("visibility", "hidden");
	$(destPage).css("visibility", "visible");
	
}

function createGame()
{
	let gameCode = "thisIsATestString";
	hostUsr = true;
	$("#startBtn").css("visibility", "visible");
	//TODO: write code to send request to create a new game
	joinGame(gameCode);
}

function joinGame(gameCode)
{
	//TODO: write code to request to join a game
	console.log(gameCode);
	goTo("#waitingRoom");
}

function startGame()
{
	//TODO: write code to tell server that game is starting
	
	goTo("#playGame");
}