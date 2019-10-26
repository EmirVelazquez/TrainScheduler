//Master function that will only execute after the DOM has Loaded
$(document).ready(function () {
    //Web App's Firebase configuration is held here in this object
    var config = {
        apiKey: "AIzaSyBOkxcR9PEs_CoYM6DYyR0gSUExt7Io6c4",
        authDomain: "train-scheduler-b3198.firebaseapp.com",
        databaseURL: "https://train-scheduler-b3198.firebaseio.com",
        projectId: "train-scheduler-b3198",
        storageBucket: "train-scheduler-b3198.appspot.com",
        messagingSenderId: "1059400761925",
        appId: "1:1059400761925:web:4a7b9914e4d3491dbad92c",
        measurementId: "G-E0GZ3Q20WB"
    };
    //This line Initializes Firebase
    firebase.initializeApp(config);
    //This line makes a variable to referenfe the database
    var database = firebase.database();

    //This on click event handler will run after the user hits the submit button
    $("#addTrain").on("click", function (event) {
        //When user clicks submit on form, four local variables will be made to hold user input
        var nameBox = $("#trainNameInput").val().trim();
        var destinationBox = $("#trainNameInput").val().trim();
        var timeBox = $("#timeInput").val().trim();
        var minutesBox = $("#minutesInput").val().trim();
        //This if statement will check to see if any of the input values are empty, if they are form will not be submitte to database
        if (nameBox.length === 0 || destinationBox.length === 0 || timeBox.length === 0 || minutesBox.length === 0) {
            //Test in console for now, may try to implement a modal if enough time
            console.log("Please fill out every box: May try to implement a modal if I have enough time");
            //If all of the form text boxes contain information then they will be pushed to the database
        } else {
            //This line prevents the user from trying to submit the form, user can hit enter on keyboard or click button
            event.preventDefault();
            //This line will take user train name input, remove spaces, and place inside a local variable
            var trainName = $("#trainNameInput").val().trim();
            //This line will take user destination input, remove spaces, and place inside a local variable
            var destinationName = $("#destinationInput").val().trim();
            //This line will take user first train time input, remove spaces, and place inside a local variable
            var trainTime = $("#timeInput").val().trim();
            //This line will take frequency user input, remove spaces, and place inside a local variable
            var trainMinutes = $("#minutesInput").val().trim();

            //This line will make a local "temporary" object for holding train data from user input, also adds a timestamp to database
            var newTrain = {
                name: trainName,
                destination: destinationName,
                time: trainTime,
                minutes: trainMinutes,
                nextArrival: trainTime,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            };

            //This line will upload the new train data to the database
            database.ref().push(newTrain);

            console.log("Train Data Successfully Added");

            //These lines will clear the text boxes after each submission
            $("#trainNameInput").val("");
            $("#destinationInput").val("");
            $("#timeInput").val("");
            $("#minutesInput").val("");
        }
    });

    //This is a Firebase event for adding a train schedule to the database and a new row in the html when a user inputs new entry
    database.ref().on("child_added", function (childSnapshot) {
        //These lines take the snapshot values and places them inside of a variable
        var trainName = childSnapshot.val().name;
        var destinationName = childSnapshot.val().destination;
        var trainTime = childSnapshot.val().time;
        var trainMinutes = childSnapshot.val().minutes;
        //This line utilizes moment.js library to take the military input time of the first train, subtracts 1 year and makes it into a Unix Time Stamp
        var firsTrain = moment(trainTime, "hh:mm").subtract(1, "years");
        //This line will calculate difference in time from now every minute and from firstTrain variable, result is in seconds
        var differenceTime = moment().diff(moment(firsTrain), "minutes");
        //This line finds the remainder after division of current seconds(differenceTime) and the frequency of train in minutes
        var remainder = differenceTime % trainMinutes;
        //This line subtracts the first logged train time by the remainder
        var minutesAway = trainTime - remainder;
        //This line will add the current time (moment()) to minutesAway and place inside nextArrival container
        var nextArrival = moment().add(minutesAway, "minutes");
        //This line formats the nextArrival container to hold information in the hh:mm format
        nextArrival = moment(nextArrival).format("hh:mm");
        //This line will create a variable newRow with table data inside of it
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destinationName),
            $("<td>").text(trainMinutes),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway)
        );
        //This line will append the newRow to the table and place it inside the body of the table
        $("#trainTable > tbody").append(newRow);
        //This function creates an error handler, and will console log the error code
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });




































});

