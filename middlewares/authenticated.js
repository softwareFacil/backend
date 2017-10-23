'use strict'

const JWT = require( 'jwt-simple' );
const MOMENT = require( 'moment' );
var secret = 'Proyecto Fondef CA13I10331';

exports.ensureAuth = function( req, res, next ){
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'La peticion no tiene cabecera de authenticación' });
  }

  var token = req.headers.authorization.replace( /['"]+/g, '' );

  try {
    var payload = JWT.decode( token, secret );

    if ( payload.exp <= MOMENT().unix() ) {
      return res.status(401).send({ message: 'El token ha expirado' });
    }
  } catch (ex) {
    return res.status(404).send({ message: 'El token no es válido' });
  }

  req.user = payload;

  next();
}
