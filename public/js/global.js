var app = angular.module( "bartender-reference", [ 'ngRoute' ] );

firebase.initializeApp
( {
    apiKey: "AIzaSyDLzf9yBbaCdQD_oI1baR1eR805zWeladE",
    authDomain: "bartender-reference.firebaseapp.com",
    databaseURL: "https://bartender-reference.firebaseio.com"
} );

var database = firebase.database();