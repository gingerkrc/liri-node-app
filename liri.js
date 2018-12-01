require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

if (command === "concert-this") {
    bandsInTownSearch();
} else if (command === "movie-this") {
    omdbSearch();
} else if (command === "spotify-this-song") {
   spotifySearch();
} else if (command === "do-what-it-says") {
    doWhatItSays();
} else {
    console.log("Please enter a valid command");
};

function spotifySearch() {
    if (!userInput) {
        userInput = "The Sign Ace of Base";
    }
    spotify.search({type: "track", query: userInput, limit: 1 })
    .then(function(data){
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log("Artist: " + songs[0].artists[0].name);
            console.log("Song: " + songs[0].name);
            console.log("Preview Link: " + songs[0].preview_url);
            console.log("Album: " + songs[0].album.name);
        }
    })
};

function bandsInTownSearch() {
    if (!userInput) {
        userInput = "Fleetwood Mac";
    }
    queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=anythingfortheappidwillwork";
    
    request(queryURL, function (error, data, body) {
        if (error) console.log(error);

        var result  =  JSON.parse(body)[0];
        console.log("Venue Name: " + result.venue.name);
        console.log("Venue Location " + result.venue.city);
        console.log("Date of Event: " +  moment(result.datetime).format("MM/DD/YYYY"));
    })
};

function omdbSearch() {
    if (!userInput) {
        userInput = "Mr. Nobody";
    }
    queryURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
   
    request(queryURL, function (error, data, body) {
        if (error) {
            console.log(error);
        }

        var result  =  JSON.parse(body);
        console.log("Title: " + result.Title);
        console.log("Year: " + result.Released);
        console.log("IMDB Rating: " + result.imdbRating );
        console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
        console.log("Country: " +  result.Country);
        console.log("Language: " + result.Language);
        console.log("Movie Plot: " + result.Plot);
        console.log("Cast: " +  result.Actors);
      
    })
};

function doWhatItSays() {
    var command = [];
    var userInput = "";
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
    var data = data.split(",");
    command = data[0].split("\r\n");
    userInput = data[1];
    
    if (command[0] === "spotify-this-song") {
        spotifySearch();
    } else if (command[0] === "movie-this") {
        omdbSearch();
    } else if (command[0] === "concert-this") {
        bandsInTownSearch();
    }
    })
};