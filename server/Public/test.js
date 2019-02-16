/*
window.onload = function() {
    
    // Check to see if the browser supports the GeoLocation API.
    if (navigator.geolocation) {
    document.write('Success!');
    } else {
    // Print out a message to the user.
    document.write('Your browser does not support GeoLocation');
    }

    // Get the location
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // Show the map
        var style = document.createElement("h1");
        var text = document.createTextNode(prompt("This is your coordinates are: " + lat + ", " + lon));
        h.appendChild(text);
        document.body.appendChild(style);
    });

}
*/
