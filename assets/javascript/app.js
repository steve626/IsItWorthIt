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
       carCost(response);
       carEco(response);
	     
       $("#distanceInfo").append("From " + origin + " to " + destination + " the distance is " + Math.round(response.route.distance) + " miles. ");
       $("#drivetime").append("Currently, drive time is: " + response.route.formattedTime + " hours. ");
      

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

          $("#driveEco").append(driveCarbon + "lbs CO2/person.");
        };


        $("#drivecost").append("The total cost to drive: $" + carCost);

    

        function flyCost(x){
          var flyCost = 0;
          var flyTime = 0;
          var flyEco = 0;
        
          console.log(x.route.distance);
   			 flyCost =((parseInt(x.route.distance) * 0.11) + 50);
         
          console.log("Avg Fare: $"+ flyCost);
        
          //need flying time
          //formula is flight duration plus 195 minutes (time driving to/from airport, waiting to board and waiting for luggage)
        //flyTime = ((moment.duration(parseInt(//flying duration//)).asMinutes) + 195 );

        console.log("fly time: " + flyTime),
        
        function flyHours(flytime) {
            var h = flyTime / 60 | 0;
            var m = flyTime % 60 | 0;
            return moment.utc().hours(h).minutes(m).format("HH:mm A");

            console.log("fly time: " + flyHours());
        };


        // console.log("timeCost: $" + timeCost);
        // carCost = Math.round(timeCost + gasCost);
        // console.log("total car cost: $"+ carCost);    
          
  
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
         console.log("GOOGLE TRANSIT DURATION: " + response.routes[0].legs[0].duration.text);
         console.log("GOOGLE TRANSIT DISTANCE: " + response.routes[0].legs[0].distance.text);
 
      });

    //Flight API (Still Pending)

    var queryURLF = "https://api.flightstats.com/flex/schedules/rest/v1/jsonp/from/PHX/to/LAX/departing/2018/3/30?appId=c5590eb9&appKey=+df8ff1453a113bf7b675d517326983ea";

    $.ajax({
      url: queryURLF,
      method: 'GET',
      dataType: 'jsonp',
   //  cache: false,
    }).then(function(response) {
      console.log(response);
      
   });


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


