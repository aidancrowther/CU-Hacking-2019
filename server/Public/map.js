  var map;
  function initMap() {
    // Create the map object.
    map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		scaleControl: true
		
		//set default center
	
	});
	
	var diameter;
	
	map.setZoom(15);
    map.setCenter({lat: 33.4255, lng: -111.9400});
	
	var marker = new google.maps.Marker();
 
	var coordinates = {lat: 33.4255, lng: -111.9400};
	marker.setPosition(coordinates);	
	marker.setMap(map);
	marker.setTitle('Tempe');
	
	var deathCircle = new google.maps.Circle({
		strokeColor: '#FE7569',
		strokeOpacity: 1,
		strokeWeight: 2,
		fillColor: 'transparent',
		fillOpacity: 0.3,
		map: map,
		center: map.center,
		radius: 1000
		
		
	});
	
  }

	  
 
  
  