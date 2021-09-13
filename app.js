require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //dotenv -> process.env. NEVER PUSH CREDENTIALS INTO GITHUB
    clientSecret: process.env.CLIENT_SECRET // we went with .env because this file wont go to github cause it starts with dot  and within .gitignore it is 
  }); // will be ignored when pushing
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
 //Teacher dont understand it jusat accept it the only thing thast u need to understand is that spotify receives credentials the ids we put in .env  



 // Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
  });


  app.get('/artist-search',async (req, res) => {

  const data = await spotifyApi.searchArtists(req.query.artistName);
 // console.log(data.body.artists);
  const allArtists = data.body.artists.items;
  res.render('artist-search-results', {allArtists})
  
});

//app.get('/albums/:artistId' : something is the route parameter
app.get('/albums/:artistId',async (req, res) => {
    try{
    const data = await spotifyApi.getArtistAlbums(req.params.artistId);
    const allAlbums =  data.body.items
   // console.log(data.body.items)
    res.render('albums', {allAlbums})
    } catch(e){
        console.log("Error", e)
    }
});

app.get('/albums-tracks/:trackId',async (req, res) => {
    try{
    const data = await spotifyApi.getAlbumTracks(req.params.trackId);
    const allTracks =  data.body.items
   // console.log(data.body.items)
    res.render('tracks', {allTracks})
    } catch(e){
        console.log("Error", e)
    }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
