require("dotenv").config();
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var grabKeys= require("./keys.js");

// commands
// * `my-tweets`


// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`
var command = process.argv[2];
switch (command){
    case "my-tweets":
        //show your last 20 tweets
        console.log('tweet');
        break;
    case "spotify-this-song":
        console.log("spotify this sonh");   
        break;
    case "movie-this":
        console.log("movie-whatever");
        break;
    case "do-what-it-says":
        console.log("do what i say");        
}