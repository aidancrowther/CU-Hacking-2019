var citymap = {};
citymap['newyork'] = {
  center: new google.maps.LatLng(40.714352, -74.005973),
  population: 8143197
};

var cityCircle;
var bounds = new google.maps.LatLngBounds();

function drawCircle(point, radius, dir) { 
  var d2r = Math.PI / 180;   // degrees to radians 
  var r2d = 180 / Math.PI;   // radians to degrees 
  var earthsradius = 3963; // 3963 is the radius of the earth in miles use 6371 if using kilometers
  var points = 32; 

  // find the raidus in lat/lon 
  var rlat = (radius / earthsradius) * r2d; 
  var rlng = rlat / Math.cos(point.lat() * d2r); 

  var extp = new Array(); 
  if (dir==1)   {var start=0;var end=points+1} // one extra here makes sure we connect the ends
  else      {var start=points+1;var end=0}
  for (var i=start; (dir==1 ? i < end : i > end); i=i+dir) { 
    var theta = Math.PI * (i / (points/2)); 
    var ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
    var ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
    extp.push(new google.maps.LatLng(ex, ey)); 
    bounds.extend(extp[extp.length-1]);
  } 
  return extp;
}

function initialize() {
  // Create the map.
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.09024, -95.712891),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var outerbounds = [ // covers the (mercator projection) world
        new google.maps.LatLng(85,180),
    new google.maps.LatLng(85,90),
    new google.maps.LatLng(85,0),
    new google.maps.LatLng(85,-90),
    new google.maps.LatLng(85,-180),
    new google.maps.LatLng(0,-180),
    new google.maps.LatLng(-85,-180),
    new google.maps.LatLng(-85,-90),
    new google.maps.LatLng(-85,0),
    new google.maps.LatLng(-85,90),
    new google.maps.LatLng(-85,180),
    new google.maps.LatLng(0,180),
    new google.maps.LatLng(85,180)];

    // options for the polygon
    var populationOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      paths: [outerbounds,drawCircle(citymap['newyork'].center,10,-1)]
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Polygon(populationOptions);
    map.fitBounds(bounds);
}
