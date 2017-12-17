'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var TypeSchema = Schema({
  nombre: String
});

module.exports = MONGOOSE.model( 'Types', TypeSchema );
