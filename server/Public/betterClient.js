$(document).ready(function(){
    // Get the location
    getPos();
});

let pos = [0.0, 0.0];

function updateLoc(lat, lon){

    pos = [lat, lon];
    socket.emit('updatePos', [lat, lon]);

}

function getPos(){
    navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // Show the map
        updateLoc(lat, lon);
    });
}