'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var UserSchema = Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  role: String
});

module.exports = MONGOOSE.model( 'User', UserSchema );
