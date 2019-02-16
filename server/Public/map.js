  var map;
  function initMap() {
    // Create the map object.
    map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		scaleControl: true
		
	
	});
	
	var diameter;
	
	map.setZoom(15);
    map.setCenter({lat: 33.4255, lng: -111.9400});
	
	var marker = new google.maps.Marker();
 
	var coordinates = {lat: 33.4255, lng: -111.9400};
	marker.setPosition(coordinates);	
	marker.setMap(map);
	marker.setTitle('Tempe');
	
  }