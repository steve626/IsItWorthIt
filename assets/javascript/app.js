
//GLOBAL VARIABLES
  var gasPrice = 2.536 //$-gallon from aaa.com
  var hourValue = 25 //$-hour based on median income in usa

  var carCarbon = 19.6 //lbs/gallon
  var flyCarbon = 0.25 //lbs/flight mile

  var carTime = 0;
	var carEco = 0;
  var carCost = 0;

	var passengerCount = 0;
	var transitCost = 0;
	var transitTime = 0;
	var transitEco = 0;
  
  var flyFare = 0;
  var flyCost = 0;
  var flyTime = 0;
  var flyEco = 0;

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
     var queryURLMQL = "https://www.mapquestapi.com/search/v3/prediction?key="+APIkeyMQL+"&limit=5&collection=adminArea,address&q="+query;
    
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
     var queryURLMQL = "https://www.mapquestapi.com/search/v3/prediction?key="+APIkeyMQL+"&limit=5&collection=adminArea,address&q="+query;

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
  passengerCount = passengers[0].valueAsNumber;
  console.log("Passenger Count: "+passengerCount);
  console.log(carType);
  $("#location").val("");
  $("#destination").val("");
  $("#number").val(1); 
  $("#sel1").val("Compact");
  $("#drivingKey").val("");
  $("#flyingKey").val("");
  $("#transitKey").val("");

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
      $("#transit-time").html("Transit Time: <b>" + response.routes[0].legs[0].duration.text + "</b>");
      var formatedTransitTime = response.routes[0].legs[0].duration.text.split(" ");
      transitTime = (parseInt(formatedTransitTime[0])*60)+parseInt(formatedTransitTime[2]);

      console.log("GOOGLE TRANSIT DURATION: " + response.routes[0].legs[0].duration.text);
      console.log("GOOGLE TRANSIT DISTANCE: " + response.routes[0].legs[0].distance.text);
      var tDistance = ((response.routes[0].legs[0].distance.value)/1609); 
      console.log("tDist: " + tDistance);
      var tc = Math.round(tDistance * 19 /100);
      console.log("TC:"+tc);
     $("#transit-fare").html("Estimated Transit Fare: <b>$"+tc + " per person</b>");   
    	transitCost = (Math.round(((response.routes[0].legs[0].duration.value)/3600) * 25))+ tc;
     $("#transit-cost").html("The total cost for transit: <b>$" + transitCost + " per person</b> ($25 per hour of your time)") 
       
     transitEco = Math.round((tDistance / 5000 * 2204.6)/4);
     $("#transit-Eco").html("Estimated Carbon Footprint:<b> "+transitEco+" lbs CO2/person </b>");
    
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
       $("#passCount").html("for " + passengerCount + " people traveling in a " + carType + " car.");
      
      //CALCULATE DRIVING - cost of fuel for driving & total cost of your time
      carTime = response.route.formattedTime;
      formatCarTime = carTime.split(":");
      console.log("Formated Car Time:"+formatCarTime[0]);
      $("#drivetime").html("Estimated drive time is: <b>" + parseInt(formatCarTime[0], 10) + " Hours " + formatCarTime[1] + " Minutes</b>");
      carTime =  (parseInt(formatCarTime[0], 10) * 60)+parseInt(formatCarTime[1]);

      autoCost(response);  
      function autoCost(x) {
        var gasCost = 0;
        var timeCost = 0;
 			  if (carType === "Electric") {
          //cost of electricity to charge car is about 4-cents per mile
   			  gasCost =(x.route.distance * 0.04)/passengerCount;
          console.log("GasCostEL:"+gasCost);
          $("#carGasCost").html("Estimated electricity cost:" + " <b>$" + Math.round(gasCost)+" per person</b>");
        
        } else if (carType !== "Electric") {
          //cost of gallon of gas based on price from AAA and average mpgs per car class
   			  gasCost = ((x.route.distance/mpgObj[carType])*gasPrice)/passengerCount;
          console.log("GasCost: $" +gasCost);
	        $("#carGasCost").html("Estimated gas cost:" + " <b>$" + Math.round(gasCost)+" per person</b>");
        }
        //average cost of your hour as $25
        timeCost = (((parseInt(formatCarTime[0])) + (parseInt(formatCarTime[1])/60)))*25;
        console.log(formatCarTime[0] + "," + (formatCarTime[1])/60);
        console.log(timeCost);
        carCost = Math.round(timeCost + (gasCost/passengerCount));
        console.log("total car cost: $"+ carCost);
        $("#drivecost").html("The total cost to drive: <b>$" + carCost+" per person</b> ($25 per hour of your time)");           
        };
       
      carEco(response);
      function carEco(x) {
          //var driveCarbon = 0;
          //calculates average car emissions based on miles driven and MPGs of cars in array
          carEco = parseInt((Math.round(((x.route.distance/mpgObj[carType])*carCarbon)/passengerCount)));
          console.log("carEco: " + carEco);
          $("#driveEco").html("Estimated Carbon Footprint: <b>" + carEco + "lbs CO2/person</b>"); 
        };
        
      //CALCULATE FLIGHTS
        
        //Estimate Flight Fare
        flyFare(response);

        function flyFare(x) {
         console.log(x.route.distance);
         flyFare = Math.round(((parseInt(x.route.distance) * 0.11) + 50)*passengerCount);
         console.log("Avg Fare: $"+ flyFare);
         $("#flyfare").html("Avg airfare: <b>$" + flyFare + " per person</b>"); 
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
            
            var formattedTime = (h + " Hours " + m + " Minutes");
            console.log("fly time2: " + formattedTime);
            $("#flytime").html("Est. travel time:<b> " + formattedTime + "</b> (inc. 3 hours for travel to/from airport)");

            //Adds value of time traveling to airfare
            flyCost = Math.round((parseInt((flyTime/60) * 25) + parseInt(flyFare)));
            $("#flycost").html("The total cost to fly: <b>$" + flyCost + " per person</b> ($25 per hour of your time)");
          };


        // Estimate Flight Carbons Footprint
       		flyCarbon(response);
       		function flyCarbon(x) {
            //calculates CO2 emissions based on mile of air travel (0.25lbs C per passenger)
            flyEco = Math.round(parseInt(x.route.distance)*0.25);
            console.log("flyCarbon: " + flyEco);
            $("#flyEco").html("Estimated Carbon Footprint: <b>" + flyEco + "lbs CO2/person</b>");
          };
          
        //adds leaf to the CO2 friendly option
        console.log("Eco Compares: "+carEco+", " + flyEco+", " + transitEco);   
        if (carEco < flyEco && carEco < transitEco) {
            $("#drivingKey").append("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
          } else if (flyEco < carEco && flyEco < transitEco) {
            $("#flyingkey").append("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
          } else if (transitEco < carEco && transitEco < flyEco) {
            $("#transitkey").append("<i " + "class='fas " + "fa-leaf '" + "id='leafkey'>" + "<i>");
          };
  
          //Adds clocks to fastest option
          console.log("Time Compares: "+carTime+", " + flyTime+", " + transitTime);   
          if (carTime < flyTime && carTime < transitTime) {
            $("#drivingKey").append("<i " + "class='fas " + "fa-clock '" + "id='timekey'>" + "<i>");
          } else if (flyTime < carTime && flyTime < transitTime) {
            $("#flyingkey").append("<i " + "class='fas " + "fa-clock '" + "id='timekey'>" + "<i>");
          } else if (transitTime < carTime && transitTime < flyTime) {
            $("#transitkey").append("<i " + "class='fas " + "fa-clock '" + "id='timekey'>" + "<i>");
          };

          //Adds dollar sign to cheapest option
          console.log("Cost Compares: "+carCost+", " + flyCost+", " + transitCost);   
          if (carCost < flyCost && carCost < transitCost) {
            $("#drivingKey").append("<i " + "class='fas " + "fa-dollar-sign '" + "id='moneykey'>" + "<i>");
          } else if (flyCost < carCost && flyCost < transitCost) {
            $("#flyingkey").append("<i " + "class='fas " + "fa-dollar-sign '" + "id='moneykey'>" + "<i>");
          } else if (transitCost < carCost && transitCost < flyCost) {
            $("#transitkey").append("<i " + "class='fas " + "fa-dollar-sign '" + "id='moneykey'>" + "<i>");
          };


     });
  

    
      
     }
  }, function(errorObject) { //Error for Google API (Entire Code is wrapped in this call)
    alert ("Whoops! An error has occured. Please ensure the locations entered are valid.");
    console.log("GOOGLE API ERROR: " + errorObject.code);
  });
   
}); // End of Submit Click Function

