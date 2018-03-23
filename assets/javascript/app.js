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

$("#reset").on("click", function() {
  location.reload();
});

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
	     
       $("#distanceInfo").append("From " + origin + " to " + destination + " the distance is " + Math.round(response.route.distance) + " miles ");
       $("#drivetime").append("Currently, drive time is: " + response.route.formattedTime);
      

			function carCost(x) {
        var gasCost = 0;
        var timeCost = 0;
 			 if (carType === "Electric") {
          console.log(x.route.distance);
   			 gasCost =(x.route.distance * 0.04)/passengers[0].valueAsNumber;
         //return gasCost;
          console.log("GasCostEL:"+gasCost);
  			} else if (carType !== "Electric") {
          console.log(x.route.distance);
          console.log(mpgObj[carType]);
          console.log(gasPrice);
          console.log(passengers[0].valueAsNumber);
   			  gasCost = ((x.route.distance/mpgObj[carType])*gasPrice)/passengers[0].valueAsNumber;
        //  return gasCost;
          console.log("GasCost: $" +gasCost);
	  $("#carGasCost").append("Your gas cost:" + " $" + Math.round(gasCost) + " MPG");
  				}
        timeCost = ((parseInt(response.route.formattedTime))*25);
        console.log("timeCost: $" + timeCost);
        carCost = Math.round(timeCost + gasCost);
        console.log("total car cost: $"+ carCost);        
        };
       
        
        function carEco(x) {
          var driveCarbon = 0;

          driveCarbon = parseInt((Math.round(((x.route.distance/mpgObj[carType])*carCarbon)/passengers[0].valueAsNumber)));
          console.log("carEco: " + driveCarbon);

          $("#driveEco").append(driveCarbon + "lbs CO2/person");
          $("#drivecost").append("The total cost to drive: $" + carCost); 
        };
					
       		flyCost(response);
       		flyCarbon(response);
       		flyHours(response);
					
        	var flyCost = 0;
          var flyTime = 0;
          var flyEco = 0;

  
        function flyCost(x){
          
        
          console.log(x.route.distance);
   			 flyCost =((parseInt(x.route.distance) * 0.11) + 50);
         
          console.log("Avg Fare: $"+ flyCost);

          $("#flycost").append("Avg airfare: $" + flyCost);
          
        }
        
          //need flying time
          //formula is flight duration plus 195 minutes (time driving to/from airport, waiting to board and waiting for luggage)
        
        
        flyHours();

        
        
        function flyHours(x) {         
            flyTime = (((dist/475) * 60 ) + 195 );
            console.log("fly time1: " + flyTime);
            var h = flyTime / 60 | 0;
            var m = flyTime % 60 | 0;
           var formattedTime = moment.utc().hours(h).minutes(m).format("HH:mm");

            console.log("fly time2: " + formattedTime);

            $("#flytime").append(formattedTime + "est. travel time");

        };

        
       

        function flyCarbon(x) {
          var flyCo2 = (parseInt(x.route.distance)*0.25);
        
          console.log("flyCarbon: " + flyCo2);

          $("#flyEco").append(flyCo2 + "lbs/CO2 per person");
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
  
  
  
// function transitCost(transitCost) {
//             var h = flyTime / 60 | 0;
//             var m = flyTime % 60 | 0;
//             return moment.utc().hours(h).minutes(m).format("HH:mm A");

//             console.log("fly time: " + flyHours());

//             $("#flytime").append(flyHours + "est. travel time");

//         };

       
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
  
//Average Fare = $50 + (Distance * $0.11)



//electric time per mile to charge = 0.43 minutes/mile traveled 
//electric cost per mile to charge = 0.04 dollars/mile traveled



//get start and end point from user input




//get car type from user input

//get miles and travel time from travel maps api, driving and flying

//get flight cost from travel api 

//if gas car picked: 
//((tripMiles / MPG) * gasPrice) = trip cost

//(tripTime * hourValue) = time cost

// ***functions from Steve
//  function carTime() {
//    if carType === "Electric" {
//      carTime = ((driveDist * 0.43) + tripTime);
//      return carTime;
 //   } else if carType !== "Electric" {
//      carTime = tripTime;
 //     return carTime;
//    }
//  }
  
//  function carEco() {
//      carEco = (for i = carType[i]; 
 //               ((driveDist/mpgObj[i])*carCarbon)/("#passengers").val().trim());
 //   return carEco;
 //   }
 // }
    
//    function flightTime() {
// flightTime = ( (((time in flight)/60) + 210minutes))/60)
//}            
    
//    function flyCost() {
//  flyCost = (flightTime * hourValue) + ticketPrice;
//}

//		function flyEco() {
 //     flightDistance * flyCarbon 
 //   }   



//if electric car picked:
    //miles to drive * 0.43 = time to charge, add to trip time (very generic, Tesla is much faster)

    //((tripTime + chargeTime)*hourValue) = time cost

    //miles to drive * 0.04 = cost of electricity for trip (very generic).

    //(tripMiles * 0.04) = trip cost


//for flight:
    // trip cost = flight cost
    //time cost = (flight time + 210 minutes of incidental travel time ) * hourValue
});


