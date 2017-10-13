'use strict'

const JWT = require( 'jwt-simple' );
const MOMENT = require( 'moment' );
var secret = 'Proyecto Fondef CA13I10331';

exports.createToken = function( user ){
  var payload = {
    sub: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    rol: user.role,
    iat: MOMENT().unix(),
    exp: MOMENT().add( 30, 'days' ).unix()
  };

  return JWT.encode( payload, secret);
};
