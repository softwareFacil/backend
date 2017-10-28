'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var EventSchema = Schema({
  name: String,
  descripcion: String,
  org: String,
  espacios : {
      lat : Number,
      long : Number,
      nombre : String
  },
  fecha_inicio: String,
  fecha_termino: String,
  icon: String,
  tipo: String,
  image: String
});

module.exports = MONGOOSE.model( 'Events', EventSchema );
