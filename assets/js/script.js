// Initialize Firebase

  var config = {
    apiKey: "AIzaSyBQ_hnc-70GhoNu0i_BM4gTu-Jm3cgpLhc",
    authDomain: "train-time-41ccb.firebaseapp.com",
    databaseURL: "https://train-time-41ccb.firebaseio.com",
    projectId: "train-time-41ccb",
    storageBucket: "train-time-41ccb.appspot.com",
    messagingSenderId: "285282571990"
  };

  firebase.initializeApp(config);

// Create a variable to reference the database

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grab user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var firstTrainTime = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    firstTrain: firstTrainTime,
    frequency: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs data inputted to console
  console.log("Train name recorded to DB: " + newTrain.name);
  console.log("Destination recorded to DB: " + newTrain.destination);
  console.log("First train time recorded to DB: " + newTrain.firstTrain);
  console.log("Frequency recorded to DB: " + newTrain.frequency);

  // Alert
  alert("Train successfully added!");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  // Prevents moving to new page
  return false;
});

// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	// Store everything into a variable
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrain;
	var trainFreq = childSnapshot.val().frequency;

	// Log Info
	console.log(trainName);
	console.log(trainDest);
	console.log(firstTrainTime);
	console.log(trainFreq);

  	// Calculate the next trian arrival
 	// First Time (pushed back 1 year to make sure it comes before current time)
 	var firstTrainTimeConverted = moment.unix(firstTrainTime).format("hh:mm");
 	firstTrainTimeConverted = moment(firstTrainTimeConverted, "hh:mm").subtract(1, "years");
 	console.log(firstTrainTimeConverted);

 	// Record current time
 	var currentTime = moment();
 	console.log("Current Time: " + moment(currentTime).format("HH:mm"));

 	// Get the difference between the times
 	var timeDiff = moment().diff(firstTrainTimeConverted, "minutes");
 	console.log("Difference between first train & now: " + timeDiff);

    // Minutes Until Next Train
    var remainder = timeDiff % trainFreq;
    console.log("Remainder for min til next train calc: " + remainder);

    var minTilTrain = trainFreq - remainder;
    console.log("MINUTES TILL TRAIN: " + minTilTrain);

    // Next Train Arrival Time
    var nextTrain = moment().add(minTilTrain, "minutes").format("HH:mm");
    console.log("Next Train Arrives at: " + nextTrain);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
 	 trainFreq + "</td><td>" + nextTrain + "</td><td>" + minTilTrain + "</td></tr>")
})