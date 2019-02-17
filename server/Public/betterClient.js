$(document).ready(function(){
    // Get the location
    getPos();
});

let pos = [0.0, 0.0];

function getPos(){
    navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // Show the map
        pos = [lat, lon];
        console.log(pos);
        socket.emit('updatePos', pos);
    });
}