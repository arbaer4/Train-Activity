  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA7xEi3T554fZefn4yVUd4uNJ3boDten1Y",
    authDomain: "train-activity-1e8ad.firebaseapp.com",
    databaseURL: "https://train-activity-1e8ad.firebaseio.com",
    projectId: "train-activity-1e8ad",
    storageBucket: "train-activity-1e8ad.appspot.com",
    messagingSenderId: "508210309256",
    appId: "1:508210309256:web:9e429bf518d20f72"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database
  var database = firebase.database();
  var trainName;
  var trainDestination;
  var trainFrequency; 
  var firstTrain;
  var trainNextArrival;
  var trainMinutesAway;


$("button").on("click", function(event){
  //prevent form from reloading
event.preventDefault(event)
trainName = $("#trainname").val().trim();
trainDestination = $("#destination").val().trim();
firstTrain = $("#traintime").val().trim();
trainFrequency = $("#frequency").val().trim();


//console log values
console.log(trainName);
console.log(trainDestination);
console.log(firstTrain);
console.log(trainFrequency);

//upload train data to database
database.ref().push({
  dbTrainName: trainName,
  dbTrainDestination: trainDestination, 
  dbFirstTrain: firstTrain,
  dbTrainFrequency: trainFrequency
})

//alert train is added
alert("Train successfully added");

//Clears all text boxes
$("#trainname").val("");
$("#destination").val("");
$("#traintime").val("");
$("#frequency").val("");
  });

//create firebase event for adding train to the database and a row in the html when submitted

database.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val());
  //store everything into a variable

  var trainName = childSnapshot.val().dbTrainName;
  var trainDestination = childSnapshot.val().dbTrainDestination;
  var firstTrain = childSnapshot.val().dbFirstTrain;
  var trainFrequency = childSnapshot.val().dbTrainFrequency;

  //train info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTrain);
  console.log(trainFrequency);

  //calculate the train time from military to local time format
  var convertedTime = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(convertedTime);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(convertedTime), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));





//create a new row
var newRow = $("<tr>").append(
  $("<td>").text(childSnapshot.val().dbTrainName),
  $("<td>").text(childSnapshot.val().dbTrainDestination),
  $("<td>").text(childSnapshot.val().dbTrainFrequency),
  $("<td>").text(nextTrain.format("hh:mm a")),
  $("<td>").text(tMinutesTillTrain)

  
);
//append the new row to the table
$("#traintable > tbody").append(newRow);


});
