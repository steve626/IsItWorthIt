

//some functions for passangers information 
function increaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById('number').value = value;
}

function decreaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value < 1 ? value = 1 : '';
  value--;
  document.getElementById('number').value = value;
}

//Google Directions API
var APIkey = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg"
var origin = "Phoenix"
var destination = "Los Angeles"

var queryURL = "https://maps.googleapis.com/maps/api/directions/json?key="+APIkey+"&origin="+origin+"&destination="+destination

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);
      console.log(response)
    });

