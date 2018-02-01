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
var moment = require('moment');
var timeStamp = moment().format();



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
    logger.logCommand(process.argv.slice(2).join(' '));
}


function showTweets(){
    var params = {
        screen_name: 'thug_dev_life',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        logger.log('These were my last 20 tweets');  
        for (var i=0; i< tweets.length; i++){
            logger.log(`_______________________________________________________` );
            logger.log(`${i+1}: ${tweets[i].text}`);
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
            logger.log(`Song not entered so I picked one for you!`);
            showSongInfo(response);
            })
    }else{
        spotify
        .search({ type: 'track', query: userSong, limit: 1})
        .then(function(response) {
            logger.log(`Here is the first song when searching for "${userSong}"`);
            showSongInfo(response);
        })
        .catch(function(err) {
           console.log(err);
        });
    }   

}

function showSongInfo(response){
    logger.log(`______________________________________________________`);
    logger.log(`Artist:  ${response.tracks.items[0].artists[0].name}`);
    logger.log(`Name of Song: ${response.tracks.items[0].name}`);
    logger.log(`Check out the song here : ${response.tracks.items[0].external_urls.spotify}`);
    logger.log(`Album: ${response.tracks.items[0].album.name}`)
    logger.log(`__________________________________________________________`);
}

function movieDisplay(){
    var movieTitle= process.argv.slice(3).join(' ');
    var queryUrl =`http://www.omdbapi.com/?apikey=${omdb}&t=${movieTitle}&limit=1`;       
    if (movieTitle === ""){
        logger.log(`Movie not entered so I picked one for you!`);
        request(`http://www.omdbapi.com/?apikey=${omdb}&t=mr+nobody&limit=1`, function (error, response, body) {
        var mrNobodyobj = JSON.parse(body);
        showMovieInfo(mrNobodyobj);
    });
    } else {
        logger.log(`Here is the first movie when searching for "${movieTitle}"`);
        request(queryUrl, function (error, response, body) {
            var obj = JSON.parse(body);
            showMovieInfo(obj);
        });
    }
}

function showMovieInfo(dataObj){
    logger.log(`__________________________________________________________`);
    logger.log(`Title: ${dataObj.Title}`);
    logger.log(`Year Released: ${dataObj.Year}`);
    logger.log(`IMDB Rating: ${dataObj.imdbRating}`);
    logger.log(`Rotten Tomatoes Score: ${dataObj.Ratings[1].Value}`);
    logger.log(`Movie was produced in : ${dataObj.Country}`);
    logger.log(`Language: ${dataObj.Language}`);
    logger.log(`Plot: ${dataObj.Plot}`);
    logger.log(`Actors: ${dataObj.Actors}`);
    logger.log(`__________________________________________________________`);
}

const logger = {
    log: function (statement) {
        console.log(statement);
        fs.appendFile("log.txt", statement + "\n" , function (err) {
            if (err)
                return console.log(err);
        });
    },
    logCommand: function (userCommand) {
        fs.appendFile("log.txt", `${timeStamp} \n Logged Information for request : ${userCommand} \n`, (err) => {
            if (err) throw err;
          });
    }
};

doCommand();