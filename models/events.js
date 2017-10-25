'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var EventSchema = Schema({
  name: String,
  descripcion: String,
  org: String,
});

module.exports = MONGOOSE.model( 'Events', EventSchema );
