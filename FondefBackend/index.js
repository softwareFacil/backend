'use strict'

const MONGOOSE = require( 'mongoose' );
var app = require( './app' );
var port = process.env.PORT || 3789;

MONGOOSE.Promise = global.Promise;
MONGOOSE.connect( 'mongodb://localhost:27017/Fondef', { useMongoClient:true })
        .then(() => {
          console.log( 'Conexion Exitosa ..' );

          app.listen( port, () => {
            console.log( 'Servidor local con Node y Express ready' );
          });
        })
        .catch( err => console.log(err) );
