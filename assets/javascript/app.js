
//GLOBAL VARIABLES
  var gasPrice = 2.536 //$-gallon from aaa.com
  var hourValue = 25 //$-hour based on median income in usa

  var carCarbon = 19.6 //lbs/gallon
  var flyCarbon = 0.25 //lbs/flight mile

  var carTime = 0;
	var carEco = 0;
  var carCost = 0;

	var transitCost = 0;
	var transitTime = 0;
	var transitEco = 0;
  
  var flyFare = 0;
  var flyCost = 0;
	var flyTime = 0;

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


//EVENTS & FUNCTIONS
  
  // Map Quest Predictive Text for Origin Location
  $('#location').on('input', function() {
    var query = $("#location").val().trim();
    if (query.length > 2) {  
     var APIkeyMQL =  "Ss29GBXDbzePoFJUyL0XDl5eLGAKdjYu";
     var queryURLMQL = "http://www.mapquestapi.com/search/v3/prediction?key="+APIkeyMQL+"&limit=5&collection=adminArea,address&q="+query;
    
     $.ajax({
      url: queryURLMQL,
      method: 'GET',
      }).then(function(response) {
        var availableCities = [ ];  

        availableCities.push(response.results[0].displayString);
        availableCities.push(response.results[1].displayString);
        availableCities.push(response.results[2].displayString);
        availableCities.push(response.results[3].displayString);
        availableCities.push(response.results[4].displayString);
      
        console.log(availableCities);
        $( "#location" ).autocomplete({source: availableCities});

      }, function(errorObject) {
         alert ("Whoops! An error has occured. Please install and turn on CORS extension, then refresh page.");
         console.log("The read failed: " + errorObject.code);
      });
    }
  }); 

  // Map Quest Predictive Text for Destination
  $('#destination').on('input', function() {
    var query = $("#destination").val().trim();
    if (query.length > 2) {  
     var APIkeyMQL =  "Ss29GBXDbzePoFJUyL0XDl5eLGAKdjYu";
     var queryURLMQL = "http://www.mapquestapi.com/search/v3/prediction?key="+APIkeyMQL+"&limit=5&collection=adminArea,address&q="+query;

      $.ajax({
        url: queryURLMQL,
        method: 'GET',
      }).then(function(response) {
      var availableCities = [ ]; 

      availableCities.push(response.results[0].displayString);
      availableCities.push(response.results[1].displayString);
      availableCities.push(response.results[2].displayString);
      availableCities.push(response.results[3].displayString);
      availableCities.push(response.results[4].displayString);

      console.log(availableCities);
      $("#destination").autocomplete({source: availableCities});

      }, function(errorObject) {
         alert ("Whoops! An error has occured. Please install & turn on CORS extension to use APP");
         console.log("The read failed: " + errorObject.code);
      });
    } 
  });

  //Functions for passangers information
  function increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 1 : value;
    value > 4 ? value = 4 : '';
    value++;
    document.getElementById('number').value = value;
  }
  
  function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 1 : value;
    value < 2 ? value = 2 : '';
    value--;
    document.getElementById('number').value = value;
  }


// MAIN SUBMIT BUTTON CLICK - GUTS OF THE APP
  $("#submit").on("click", function() {

  //Pull Form Info into Varables, Console Log & Clear Inputs
  var origin = $("#location").val().trim();
  var destination = $("#destination").val().trim(); 
  var passengers = $("#number"); 
  var carType = $("#sel1").val().trim();
  console.log(origin);
  console.log(destination);
  console.log(passengers[0].valueAsNumber);
  console.log(carType);
  $("#location").val("");
  $("#destination").val("");
  $("#number").val(1); 
  $("#sel1").val("Compact");

//Google Directions API (Use for Transit Info & Confirm Valid Locations)
var APIkeyD = "AIzaSyB1BAEdGTc2ICoqQdaJf9Rpf3p_zCZPIGg";
var queryURLD = "https://maps.googleapis.com/maps/api/directions/json?key="+APIkeyD+"&origin="+origin+"&destination="+destination+"&mode=transit";

$.ajax({
    url: queryURLD,
     method: 'GET',
   }).then(function(response) {
    //If not found on Google API
    if (response.status === "NOT_FOUND") {
      console.log("Google API Error:"+ response.status);
      alert ("Whoops! An error has occured. Please ensure the locations entered are valid.");
     } 
     //If found on Google API
     else {
       console.log(response);
    
    //CALCULATE TRANSIT INFO
      $("#transit-time").html("Transit Time: " + response.routes[0].legs[0].duration.text);
      console.log("GOOGLE TRANSIT DURATION: " + response.routes[0].legs[0].duration.text);
      console.log("GOOGLE TRANSIT DISTANCE: " + response.routes[0].legs[0].distance.text);
      var tDistance = response.routes[0].legs[0].distance.text.match(/\d+/g); 
      var tc = tDistance * 19 /100;
     console.log("TC:"+tc);
     $("#transit-cost").html("Estimated Transit Cost: $"+tc);     
     var tCarb = (tDistance / 5000 * 2204.6)/4;
     $("#transit-Eco").html("Estimated Carbon Footprint: "+tCarb+" lbs CO2/person");
    
    // CALL MAPQUEST API
     var APIkeyMQ =  "Ss29GBXDbzePoFJUyL0XDl5eLGAKdjYu";
    var queryURLMQ = "https://www.mapquestapi.com/directions/v2/route?key="+APIkeyMQ+"&from="+origin+"&to="+destination
     $.ajax({
       url: queryURLMQ,
       method: 'GET',
     }).then(function(response) {
       
      //Log Main Response from MapQuest
       console.log(response);
       console.log("MAP QUEST DISTANCE: "+response.route.distance);
       console.log("MAP QUEST DRIVING TIME: "+response.route.formattedTime);
       $("#distanceInfo").html("From " + origin + " to " + destination + " the distance is " + Math.round(response.route.distance) + " miles ");
      
      //CALCULATE DRIVING - cost of fuel for driving & total cost of your time
      $("#drivetime").html("Est. drive time is: " + response.route.formattedTime);
       
      carCost(response);  
      function carCost(x) {
        var gasCost = 0;
        var timeCost = 0;
 			  if (carType === "Electric") {
          //cost of electricity to charge car is about 4-cents per mile
   			  gasCost =(x.route.distance * 0.04)/passengers[0].valueAsNumber;
          console.log("GasCostEL:"+gasCost);
          $("#carGasCost").html("Est electricity cost:" + " $" + Math.round(gasCost));
        
        } else if (carType !== "Electric") {
          //cost of gallon of gas based on price from AAA and average mpgs per car class
   			  gasCost = ((x.route.distance/mpgObj[carType])*gasPrice)/passengers[0].valueAsNumber;
          console.log("GasCost: $" +gasCost);
	        $("#carGasCost").html("Est gas cost:" + " $" + Math.round(gasCost));
        }
        //average cost of your hour as $25
        timeCost = ((parseInt(response.route.formattedTime))*25);
        carCost = Math.round(timeCost + gasCost);
        console.log("total car cost: $"+ carCost); 
        $("#drivecost").html("The total cost to drive ($25 per hour of your time): $" + carCost);       
      };
       
      carEco(response);
      function carEco(x) {
          var driveCarbon = 0;
          //calculates average car emissions based on miles driven and MPGs of cars in array
          driveCarbon = parseInt((Math.round(((x.route.distance/mpgObj[carType])*carCarbon)/passengers[0].valueAsNumber)));
          console.log("carEco: " + driveCarbon);
          $("#driveEco").html("Estimated Carbon Footprint: " + driveCarbon + "lbs CO2/person"); 
        };
        
        
      //CALCULATE FLIGHTS
        
        //Estimate Flight Fare
        flyFare(response);

        function flyFare(x) {
         console.log(x.route.distance);
         flyFare = Math.round((parseInt(x.route.distance) * 0.11) + 50);
         console.log("Avg Fare: $"+ flyFare);
         $("#flyfare").html("Avg airfare: $" + flyFare); 
        };

        // Estimate Flight Time using Lat/Long Distance
          var lat1 = parseInt(response.route.locations[0].latLng.lat);
          var lng1 = parseInt(response.route.locations[0].latLng.lng);
          var lat2 = parseInt(response.route.locations[1].latLng.lat);
          var lng2 = parseInt(response.route.locations[1].latLng.lng);
          var dist =  distance(lat1, lng1, lat2, lng2);
          console.log("Flight Distance:"+dist);

          function distance(lat1, lng1, lat2, lng2) { //calculates distance between two cities over curve of earth, in miles
            var R = 3959; // Radius of the earth in miles
            var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
            var dLon = (lng2 - lng1) * Math.PI / 180;
            var a = 
              0.5 - Math.cos(dLat)/2 + 
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              (1 - Math.cos(dLon))/2;
            return R * 2 * Math.asin(Math.sqrt(a));
          };

          flyHours(response);  
          function flyHours(x) {
            //calculates flight time based on flight distance divided by average flight speed
            //adds time for going to/from airport         
            flyTime = (((dist/475) * 60 ) + 180 );
            console.log("fly time1: " + flyTime);
            var h = flyTime / 60 | 0;
            var m = flyTime % 60 | 0;
            var formattedTime = moment.utc().hours(h).minutes(m).format("HH:mm");
            var formattedTime = (h + " Hours " + m + " Minutes");
            console.log("fly time2: " + formattedTime);
            $("#flytime").html("Est. travel time (inc. 3 hours for travel to/from airport): " + formattedTime);

            //Adds value of time traveling to airfare
            flyCost = Math.round((parseInt((flyTime/60) * 25) + parseInt(flyFare)));
            $("#flycost").html("The total cost to fly ($25 per hour): $" + flyCost);
          };


        // Estimate Flight Carbons Footprint
       		flyCarbon(response);
       		function flyCarbon(x) {
            //calculates CO2 emissions based on mile of air travel (0.25lbs C per passenger)
            var flyCo2 = Math.round(parseInt(x.route.distance)*0.25);
            console.log("flyCarbon: " + flyCo2);
            $("#flyEco").html("Estimated Carbon Footprint: " + flyCo2 + "lbs CO2/person");
          };
          
    
     });
  

      //adds leaf to the CO2 friendly option //Needs to Compare Transit & add Other Icrons
      if(carEco > flyCarbon) {
        var iconsArray = ["fa-leaf", "fa-car", "fa-plane", "fa-train", "fa-clock"];
        var iconsArrayLength = iconsArray.length;
        $("#drivingKey").html("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
      } else if (flyCarbon > carEco) {
        $("#flyingkey").html("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
      };
    }

  }, function(errorObject) { //Error for Google API (Entire Code is wrapped in this call)
    alert ("Whoops! An error has occured. Please ensure the locations entered are valid.");
    console.log("GOOGLE API ERROR: " + errorObject.code);
  });
   
}); // End of Submit Click Function


