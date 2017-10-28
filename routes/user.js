'user strict'

const EXPRESS = require( 'express' );
const UserController = require( '../controllers/user' );

var api = EXPRESS.Router();
var md_auth = require( '../middlewares/authenticated' );

var multipart = require( 'connect-multiparty' );
var md_upload = multipart({ uploadDir: './img/imagenes' });

api.get( '/events', UserController.getEvents );
api.post( '/register', UserController.saveUser );
api.post( '/saveEvent', UserController.saveEvent );
api.post( '/login', UserController.login );
api.put( '/update-user/:id', md_auth.ensureAuth, UserController.updateUser );
api.post( '/upload-img-event', [ md_upload ], UserController.uploadImg );
api.get( '/get-img/:imageFile', UserController.getImageFile );
api.get( '/get-icon/:iconFile', UserController.getIconFile );
api.post( '/type-event', UserController.TypeEvents );


module.exports = api;
