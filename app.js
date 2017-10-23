'use strict'

const EXPRESS = require( 'express' );
const BODYPARSER = require( 'body-parser' );


var app = EXPRESS()

//rutas
var user_rotues = require( './routes/user' );

// Middlewares de body-parser
app.use( BODYPARSER.urlencoded({ extended:false }) );
app.use( BODYPARSER.json() );

//Configurar cabecesar y cors
app.use(( req, res, next ) => {
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method' );
  res.header( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE' );
  res.header( 'Allow', 'GET, POST, OPTIONS, PUT, DELETE' );
  next()
});

//rutas base
app.use( '/api', user_rotues);

// app.get( '/probando', ( req, res ) => {
//   res.status(200).send({ message: 'Test' });
// })

module.exports = app;
