require("dotenv").config();

var keys= require("./keys.js");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);



// commands
// * `my-tweets`--show last 20 tweets


// * `spotify-this-song` ---show info of the song in terminal (artist, song name, preview link of song in spotify, album the song is form)
//-- if no song is available default is Ace of Base. The Sign

// * `movie-this`// default is Mr. Nobody

// * `do-what-it-says`
var command = process.argv[2];
console.log(command);
// switch (command){
//     case "my-tweets":
//         //show your last 20 tweets
//         console.log('tweet');
//         break;
//     case "spotify-this-song":
//         console.log("spotify this sonh");   
//         break;
//     case "movie-this":
//         console.log("movie-whatever");
//         break;
//     case "do-what-it-says":
//         console.log("do what i say"); 

// }