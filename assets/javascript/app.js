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
 
  
  //Map Quest Key
  var APIkey = 	"Ss29GBXDbzePoFJUyL0XDl5eLGAKdjYu";
  var origin = "Phoenix";
  var destination = "Los Angeles";

  var queryURL = "http://www.mapquestapi.com/directions/v2/route?key="+APIkey+"&from="+origin+"&to="+destination
     $.ajax({
       url: queryURL,
       method: 'GET',
    //  dataType: 'jsonp',
    //  cache: false,
     }).then(function(response) {
       console.log(response);
       console.log(response.route.distance);
       console.log(response.route.formattedTime);
       

    });


    //Flight API

    var queryURL2 = "https://api.flightstats.com/flex/schedules/rest/v1/jsonp/from/PHX/to/LAX/departing/2018/3/30?appId=c5590eb9&appKey=+df8ff1453a113bf7b675d517326983ea";

    $.ajax({
      url: queryURL2,
      method: 'GET',
      dataType: 'jsonp',
   //  cache: false,
    }).then(function(response) {
      console.log(response);
      
   });

//Google Directions API
// var APIkeyD = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg";
// var origin = "Phoenix";
//var destination = "Los Angeles";

//Google Directions URL var queryURL = "http://maps.googleapis.com/maps/api/directions/json?key="+APIkey+"&origin="+origin+"&destination="+destination

 //Google Places API
// var APIkey ="AIzaSyAP_J4JEw5Ro3YrVdHj-85odaS76v7ngjg";

//  var queryURL = "http://maps.googleapis.com/maps/api/directions/jsonp?key="+APIkeyD+"&origin="+origin+"&destination="+destination
//     $.ajax({
//        url: queryURL,
//        method: 'GET',
//       dataType: 'jsonp',
//       cache: false,
//      }).then(function(response) {
//        console.log(response);

//     });

  //Google Maps API
  // var APIkey ="AIzaSyCB_NNmYoFVRc6qz7_vp6IJ-9-GIkEvy5U";
