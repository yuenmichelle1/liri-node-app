require("dotenv").config();

var keys= require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require('request');
var omdb= keys.omdb.apikey;
var fs = require("fs");
var command = process.argv[2];

function doCommand(){
    switch (command){
        case "my-tweets":
            showTweets();
            break;
        case "spotify-this-song":
            var song= process.argv.slice(3).join(' ');
            spotifyLogic(song);   
            break;
        case "movie-this":
           movieDisplay();
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(err,data){
                if (err){
                    console.log(err);
                } 
                var songFS = data.split(",")[1];
                spotifyLogic(songFS);
            })

    }
}


function showTweets(){
    var params = {
        screen_name: 'thug_dev_life',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log('These were my last 20 tweets');  
        for (var i=0; i< tweets.length; i++){
            console.log(`_______________________________________________________` );
            console.log(`${i+1}: ${tweets[i].text}`);
        }
      } else {
          console.log(error);
      }
    });
}

function spotifyLogic(userSong){
    if (userSong == ""){
        spotify
        .search({ type: 'track', query: `The Sign Ace Of Base`, limit: 1})
        .then(function(response) {
            console.log(`Song not entered so I picked one for you!`);
            showSongInfo(response);
            })
    }else{
        spotify
        .search({ type: 'track', query: userSong, limit: 1})
        .then(function(response) {
            console.log(`Here is the first song when searching for "${userSong}"`);
            showSongInfo(response);
        })
        .catch(function(err) {
           console.log(err);
        });
    }   

}

function showSongInfo(response){
    console.log(`______________________________________________________`);
    console.log(`Artist:  ${response.tracks.items[0].artists[0].name}`);
    console.log(`Name of Song: ${response.tracks.items[0].name}`);
    console.log(`Check out the song here : ${response.tracks.items[0].external_urls.spotify}`);
    console.log(`Album: ${response.tracks.items[0].album.name}`)
    console.log(`__________________________________________________________`);
}

function movieDisplay(){
    var movieTitle= process.argv.slice(3).join(' ');
    var queryUrl =`http://www.omdbapi.com/?apikey=${omdb}&t=${movieTitle}&limit=1`;       
    if (movieTitle === ""){
        console.log(`Movie not entered so I picked one for you!`);
        request(`http://www.omdbapi.com/?apikey=${omdb}&t=mr+nobody&limit=1`, function (error, response, body) {
        var mrNobodyobj = JSON.parse(body);
        showMovieInfo(mrNobodyobj);
    });
    } else {
        console.log(`Here is the first movie when searching for "${movieTitle}"`);
        request(queryUrl, function (error, response, body) {
            var obj = JSON.parse(body);
            showMovieInfo(obj);
        });
    }
}

function showMovieInfo(dataObj){
    console.log(`__________________________________________________________`);
    console.log(`Title: ${dataObj.Title}`);
    console.log(`Year Released: ${dataObj.Year}`);
    console.log(`IMDB Rating: ${dataObj.imdbRating}`);
    console.log(`Rotten Tomatoes Score: ${dataObj.Ratings[1].Value}`);
    console.log(`Movie was produced in : ${dataObj.Country}`);
    console.log(`Language: ${dataObj.Language}`);
    console.log(`Plot: ${dataObj.Plot}`);
    console.log(`Actors: ${dataObj.Actors}`);
    console.log(`__________________________________________________________`);
}


doCommand();