//IsItWorthIt - compares costs of driving vs flying vs transit for travel

//globals
var gasPrice = 2.536 //$-gallon from aaa.com
var hourValue = 25 //$-hour based on median income in usa

var mpgObj = {    
    "Compact": 33,
    "Mid-sized": 29,
    "Full-sized":26,
    "Small SUV": 25,
    "Large SUV": 21,
    "Minivan": 22,
    "Pick-Up": 19,
    "Electric": 60
};


var carCarbon = 19.6 //lbs/gallon
var flyCarbon = 0.25 //lbs/flight mile

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
//reset location fields
$("#reset").on("click", function() {
  location.reload();
});

// guts of the app
$("#submit").on("click", function() {

//Pulling Form Information info Varables
var origin = $("#location").val().trim();
var destination = $("#destination").val().trim(); 
var passengers = $("#number"); 
var carType = $("#sel1").val().trim();
console.log(origin);
console.log(destination);
console.log(passengers[0].valueAsNumber);
console.log(carType);

if (passengers === 0) {
  alert("passengers cannot be zero");
  reset(); //needs to be built
};



//Google Directions API
//var APIkey = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg"
// var origin = $("#location").val().trim();
// var destination = $("#desination").val().trim();

// var queryURL = "https://maps.googleapis.com/maps/api/directions/json?key="+APIkey+"&origin="+origin+"&destination="+destination

//     $.ajax({
//      url: queryURL,
//      method: 'GET'
//    }).then(function(response) {
//      console.log("google: " + response);
//      console.log(response)
//    });

 
  
// Map Quest Key (Working, use for Driving)
  var APIkeyMQ =  "Ss29GBXDbzePoFJUyL0XDl5eLGAKdjYu";
  
  var queryURLMQ = "https://www.mapquestapi.com/directions/v2/route?key="+APIkeyMQ+"&from="+origin+"&to="+destination
     $.ajax({
       url: queryURLMQ,
       method: 'GET',
    //  dataType: 'jsonp',
    //  cache: false,
     }).then(function(response) {
       console.log(response);
       console.log("MAP QUEST DISTANCE: "+response.route.distance);
       console.log("MAP QUEST DRIVING TIME: "+response.route.formattedTime);

       //gets lat/long coordinates to determine flight distance below
       console.log("lat1: " + response.route.locations[0].latLng.lat);
       console.log("lng1: "+ response.route.locations[0].latLng.lng);
       console.log("lat2: " + response.route.locations[1].latLng.lat);
       console.log("lng2: " + response.route.locations[1].latLng.lng);
       carCost(response);
       carEco(response);
       distance(response);
      
       var lat1 = parseInt(response.route.locations[0].latLng.lat);
       var lng1 = parseInt(response.route.locations[0].latLng.lng);
       var lat2 = parseInt(response.route.locations[1].latLng.lat);
       var lng2 = parseInt(response.route.locations[1].latLng.lng);
       

       //calculates distance between two cities over curve of earth, in miles
        function distance(lat1, lng1, lat2, lng2) {
          var R = 3959; // Radius of the earth in miles
          var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
          var dLon = (lng2 - lng1) * Math.PI / 180;
          var a = 
             0.5 - Math.cos(dLat)/2 + 
             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
             (1 - Math.cos(dLon))/2;
        
          return R * 2 * Math.asin(Math.sqrt(a));
        };

       
        console.log("dist:" +  distance(lat1, lng1, lat2, lng2));

        var dist =  distance(lat1, lng1, lat2, lng2);
        console.log(dist);
       
        //writes distance and drive time to DOM
       $("#distanceInfo").append("From " + origin + " to " + destination + " the distance is " + Math.round(response.route.distance) + " miles ");
       $("#drivetime").append("Est. drive time is: " + response.route.formattedTime);
      

       //cost of fuel for driving
			function carCost(x) {
        var gasCost = 0;
        var timeCost = 0;
 			 if (carType === "Electric") {
          console.log(x.route.distance);
          //cost of electricity to charge car is about 4-cents per mile
   			 gasCost =(x.route.distance * 0.04)/passengers[0].valueAsNumber;
        
          console.log("GasCostEL:"+gasCost);
  			} else if (carType !== "Electric") {
          console.log(x.route.distance);
          console.log(mpgObj[carType]);
          console.log(gasPrice);
          console.log(passengers[0].valueAsNumber);
          //cost of gallon of gas based on price from AAA and average mpgs per car class
   			  gasCost = ((x.route.distance/mpgObj[carType])*gasPrice)/passengers[0].valueAsNumber;
       
          console.log("GasCost: $" +gasCost);

          //adds cost of fuel to DOM
	      $("#carGasCost").append("Est gas cost:" + " $" + Math.round(gasCost));
          }
          
          //average cost of your hour is $25
        timeCost = ((parseInt(response.route.formattedTime))*25);
        console.log("timeCost: $" + timeCost);

        //adds cost of your time driving and cost of fuel
        carCost = Math.round(timeCost + gasCost);
        console.log("total car cost: $"+ carCost);        
        };
       
        
        function carEco(x) {
          var driveCarbon = 0;
          //calculates average car emissions based on miles driven and MPGs of cars in array
          driveCarbon = parseInt((Math.round(((x.route.distance/mpgObj[carType])*carCarbon)/passengers[0].valueAsNumber)));
          console.log("carEco: " + driveCarbon);

          $("#driveEco").append("Estimated Carbon Footprint: " + driveCarbon + "lbs CO2/person");
          $("#drivecost").append("The total cost to drive: $" + carCost); 
        };
          
        //calculates flight data

       		flyFare(response);
       		flyCarbon(response);
       		flyHours(response);
					
        	var flyCost = 0;
          var flyTime = 0;
          var flyEco = 0;
          var airFare = 0;

  
        function flyFare(x){
          
        
          console.log(x.route.distance);

   			 flyFare = Math.round((parseInt(x.route.distance) * 0.11) + 50);
         
          console.log("Avg Fare: $"+ flyFare);

         
          
        };
        
        //flyHours();        
        
        //calculates flight time based on flight distance divided by average flight speed adding time (195 minutes) of going to/from airport
        function flyHours(x) {         
            flyTime = (((dist/475) * 60 ) + 195 );
            console.log("fly time1: " + flyTime);
            var h = flyTime / 60 | 0;
            var m = flyTime % 60 | 0;
           var formattedTime = moment.utc().hours(h).minutes(m).format("HH:mm");

            console.log("fly time2: " + formattedTime);

            $("#flytime").append("Est. travel time: " + formattedTime);

            //to match car cost adds value of time traveling to airfare

          var flyCost = Math.round((parseInt((flyTime/60) * 25) + parseInt(flyFare)));

            $("#flycost").append("The total cost to fly: $" + flyCost);
            $("#flyfare").append("Avg airfare: $" + flyFare);

        };

        //calculates CO2 emissions based on mile of air travel (0.25lbs C per passenger)      

        function flyCarbon(x) {
          var flyCo2 = Math.round(parseInt(x.route.distance)*0.25);
        
          console.log("flyCarbon: " + flyCo2);

          $("#flyEco").append("Estimated Carbon Footprint: " + flyCo2 + "lbs CO2/person");
        };

       //adds leaf to the CO2 friendly option
      if(carEco > flyCarbon) {
            var iconsArray = ["fa-leaf", "fa-car", "fa-plane", "fa-train", "fa-clock"];
            var iconsArrayLength = iconsArray.length;
            $("#drivingKey").html("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
          } else if (flyCarbon > carEco) {
            $("#flyingkey").html("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
          };
      });
       

    //Google Directions API (Use for Transit Info)
 var APIkeyD = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg";
 
  var queryURLD = "https://maps.googleapis.com/maps/api/directions/json?key="+APIkeyD+"&origin="+origin+"&destination="+destination+"&mode=transit";
 
     $.ajax({
        url: queryURLD,
         method: 'GET',
  //     dataType: 'jsonp',
   //     cache: false,
       }).then(function(response) {
         console.log(response);
  
         $("#transit-time").append("Transit Time: " + response.routes[0].legs[0].duration.text);
         console.log("GOOGLE TRANSIT DURATION: " + response.routes[0].legs[0].duration.text);
         
         console.log("GOOGLE TRANSIT DISTANCE: " + response.routes[0].legs[0].distance.text);
         var tDistance = parseInt(response.routes[0].legs[0].distance.text);
         console.log(tDistance);

         var tc = tDistance * 19 /100 | 100;
          console.log("TC:"+tc);
          $("#transit-cost").append("Estimated Transit Cost: $"+tc);
          
          var tCarb = (tDistance / 5000 * 2204.6)/4 | 100;
          $("#transit-Eco").append("Estimated Carbon Footprint: "+tCarb+" lbs CO2/person");
 
      });
  

       
///////////////////////////////

    //Flight API (Still Pending)

  //   var queryURLF = "https://api.flightstats.com/flex/schedules/rest/v1/jsonp/from/PHX/to/LAX/departing/2018/3/30?appId=c5590eb9&appKey=+df8ff1453a113bf7b675d517326983ea";

  //   $.ajax({
  //     url: queryURLF,
  //     method: 'GET',
  //     dataType: 'jsonp',
  //  //  cache: false,
  //   }).then(function(response) {
  //     console.log(response);
      
  //  });


// 9 Result Variables
	var carCost = 0;
	var carTime = 0;
	var carEco = 0;
	var flyCost = 0;
	var flyTime = 0;
	var flyEco = 0;
	var transitCost = 0;
	var transitTime = 0;
	var transitEco = 0;
  

});


