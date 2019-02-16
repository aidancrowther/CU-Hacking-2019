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
		radius:  1250
	});
	
	//NONE OF THIS WORKS
	/*
	 // Define the LatLng coordinates for the polygon's  outer path.
  var outerCoords = [
    map.getBounds
  ];

  // Define the LatLng coordinates for the polygon's inner path.
  // Note that the points forming the inner path are wound in the
  // opposite direction to those in the outer path, to form the hole.
  var innerCoords = [
    {lat: 28.745, lng: -70.579},
    {lat: 29.570, lng: -67.514},
    {lat: 27.339, lng: -66.668}
  ];

  // Construct the polygon, including both paths.
  var deathArea = new google.maps.Polygon({
    paths: [outerCoords, innerCoords],
    strokeColor: '#FFC107',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FFC107',
    fillOpacity: 0.35,
	map: map
  });
	*/	
	
	
	/*

	var deathArea = new google.maps.({	
		strokeColor: '#FE7569',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FE7569',
		fillOpacity: 0.35,
		map: map,
		//paths: [map.getBounds(), deathCircle.getBounds()]
		bounds: map.getBounds()
	});
	
	*/
	

	
  }

	  
 
  
  