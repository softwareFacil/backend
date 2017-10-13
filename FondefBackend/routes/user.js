'user strict'

const EXPRESS = require( 'express' );
const UserController = require( '../controllers/user' );

var api = EXPRESS.Router();
var md_auth = require( '../middlewares/authenticated' );

api.get( '/test', md_auth.ensureAuth, UserController.pruebas );
api.post( '/register', UserController.saveUser );
api.post( '/login', UserController.login );
api.put( '/update-user/:id', md_auth.ensureAuth, UserController.updateUser );


module.exports = api;
