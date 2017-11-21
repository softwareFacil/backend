'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var CategorySchema = Schema({
  actividades: String
});

module.exports = MONGOOSE.model( 'Categories', CategorySchema );
