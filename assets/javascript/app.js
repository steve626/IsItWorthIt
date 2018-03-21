

//Bootstrap functions for passangers information

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


//Submit button should input data

$("#submit").on("click", function() {
//Google Directions API
var APIkey = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg"
var origin = $("#location").val().trim();
var destination = $("#destination").val().trim();

var queryURL = "https://maps.googleapis.com/maps/api/directions/json?key="+APIkey+"&origin="+origin+"&destination="+destination

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);
      console.log(response)
    });

 
  
  //Map Quest Key (Working, use for Driving)
  var APIkey =  "Ss29GBXDbzePoFJUyL0XDl5eLGAKdjYu";
  var origin = $("#location").val().trim();
  var destination = $("#destination").val().trim();

  var queryURL = "https://www.mapquestapi.com/directions/v2/route?key="+APIkey+"&from="+origin+"&to="+destination
     $.ajax({
       url: queryURL,
       method: 'GET',
    //  dataType: 'jsonp',
    //  cache: false,
     }).then(function(response) {
       console.log(response);
       console.log("MAP QUEST DISTANCE: "+response.route.distance);
       console.log("MAP QUEST DRIVING TIME: "+response.route.formattedTime);
       
       $("#distanceInfo").append("From " + origin + " to " + destination + " the distance is " + response.route.distance + " miles ");
       $("#drivetime").append("Currently," + " drive time is: " + response.route.formattedTime);
    });


    //Google Directions API (Use for Transit Info)
 var APIkeyD = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg";
 var originD = $("#location").val().trim();
 var destinationD = $("#destination").val().trim();
 
  var queryURLD = "https://maps.googleapis.com/maps/api/directions/json?key="+APIkeyD+"&origin="+originD+"&destination="+destinationD+"&mode=transit";
 
     $.ajax({
        url: queryURLD,
         method: 'GET',
  //     dataType: 'jsonp',
   //     cache: false,
       }).then(function(response) {
         console.log(response);
         console.log("GOOGLE TRANSIT DURATION: " + response.routes[0].legs[0].duration.text);
         console.log("GOOGLE TRANSIT DISTANCE: " + response.routes[0].legs[0].distance.text);
 
      });

    //Flight API (Still Pending)

    var queryURL2 = "https://api.flightstats.com/flex/schedules/rest/v1/jsonp/from/PHX/to/LAX/departing/2018/3/30?appId=c5590eb9&appKey=+df8ff1453a113bf7b675d517326983ea";

    $.ajax({
      url: queryURL2,
      method: 'GET',
      dataType: 'jsonp',
   //  cache: false,
    }).then(function(response) {
      console.log(response);
      
   });



  
//Average Fare = $50 + (Distance * $0.11)

//globals
var gasPrice = 2.536 //$-gallon from aaa.com
var hourValue = 25 //$-hour based on median income in usa

var mpgObj = {
    "electric":33, 
    "compact": 60,
    "midSize": 44,
    "fullSize":37,
    "smallSuv": 34,
    "largSuv": 29,
    "miniVan": 31,
    "pickUp": 26
};
// var electricMpg = 83
// var compactMpg = 60
// var midSizeMpg = 44
// var fullSizeMpg = 37
// var smallSuvMpg = 34
// var largeSuvMpg = 29
// var miniVanMpg = 31
// var pickUpMpg = 26

var carCarbon = 19.6 //lbs/gallon
var flyCarbon = 0.25 //lbs/flight mile

//electric time per mile to charge = 0.43 minutes/mile traveled 
//electric cost per mile to charge = 0.04 dollars/mile traveled



//get start and end point from user input



//get car type from user input

//get miles and travel time from travel maps api, driving and flying

//get flight cost from travel api 

//if gas car picked: 
//((tripMiles / MPG) * gasPrice) = trip cost

//(tripTime * hourValue) = time cost




//if electric car picked:
    //miles to drive * 0.43 = time to charge, add to trip time (very generic, Tesla is much faster)

    //((tripTime + chargeTime)*hourValue) = time cost

    //miles to drive * 0.04 = cost of electricity for trip (very generic).

    //(tripMiles * 0.04) = trip cost


//for flight:
    // trip cost = flight cost
    //time cost = (flight time + 210 minutes of incidental travel time ) * hourValue
});


