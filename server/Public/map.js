var map;
var deathCircle;
function initMap() {
    // Create the map object.
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		scaleControl: true
		
		
		//set default center
	
	});
	
	var diameter;
	
	map.setZoom(14);
    map.setCenter({lat: 33.4255, lng: -111.9400});
	
	var marker = new google.maps.Marker();
 
	var coordinates = {lat: 33.4255, lng: -111.9400};
	marker.setPosition(coordinates);	
	marker.setMap(map);
	marker.setTitle('Tempe');
	
	deathCircle = new google.maps.Circle({
		strokeColor: '#18CD5E',
		strokeOpacity: 1,
		strokeWeight: 2,
		fillColor: '#8EF2B5',
		fillOpacity: 0.2,
		map: map,
		center: map.center,
		radius: 1250
	});
	
  }
  
function shrinkCircle(meters){	  
//speed of shrinking needs to be constant
//2 meters per 50 milliseconds 
	shrinkCircleRecursive((meters/2)); 
}
	
function shrinkCircleRecursive(count){
	if(count < 0) return;
	deathCircle.setRadius(deathCircle.radius - 2);
	setTimeout(shrinkCircleRecursive, 50, count-1);
}
	
function updateData(){
	let leftAlive = document.getElementById("stillAlive");
	leftAlive.innerHTML = "Still Alive: " + "100";
		
	let yourTarget = document.getElementById("targetPerson");
	yourTarget.innerHTML = "targetname"
		
	let playersInLobby = document.getElementById("playersJoined");
	playerInLobby.innerHTML = "Players in Lobby: " + "69";
		
	let listOfPlayers = document.getElementById("playerList");
	listOfPlayers.innerHTML = "playername" + " <br> "
		
}

	  
 
  
  