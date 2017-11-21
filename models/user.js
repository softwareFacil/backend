'use strict'

const MONGOOSE = require( 'mongoose' );
var Schema = MONGOOSE.Schema;

var UserSchema = Schema({
  name: String,
  descripcion: String,
  email: String,
  password: String,
  role: String,
  foto: String,
  fono: String,
  ubicacion: String,
  state: Boolean
});

module.exports = MONGOOSE.model( 'User', UserSchema );
