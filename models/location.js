'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var LocationSchema = Schema({
  name: String,
  lat: Number,
  lng: Number
});

module.exports = MONGOOSE.model( 'Location', LocationSchema );
