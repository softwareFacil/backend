'user strict'

const EXPRESS = require( 'express' );
const UserController = require( '../controllers/user' );

var api = EXPRESS.Router();
var md_auth = require( '../middlewares/authenticated' );

var multipart = require( 'connect-multiparty' );
var md_upload = multipart({ uploadDir: './img/imagenes' });
var md_uploadI = multipart({ uploadDir: './img/icono' });

api.get( '/events', UserController.getEvents );
api.get( '/users', UserController.getUsers );
api.put( '/validateUser/:userId', UserController.validateUser );
api.delete( '/removeUser/:userId', UserController.removeUser );
api.post( '/register', UserController.saveUser );
api.post( '/saveEvent', UserController.saveEvent );
api.post( '/login', UserController.login );
api.post( '/upload-img-event', [ md_upload ], UserController.uploadImg );
api.post( '/upload-img-user', [ md_uploadI ], UserController.uploadIcon );
api.get( '/get-img/:imageFile', UserController.getImageFile );
api.get( '/get-icon/:iconFile', UserController.getIconFile );
api.get( '/getEventsByType/:type', UserController.getEventsByType );
api.get( '/getEventsByOrg/:org', UserController.getEventsByOrg );
api.delete( '/removeEvent/:eventId', UserController.removeEvent );
api.get( '/getEventsBySpace/:space', UserController.getEventsBySpace );
api.get( '/getCategories', UserController.getCategories );
api.post( '/saveLocation', UserController.saveLocation );
api.get( '/getLocations', UserController.getLocations );
api.post( '/saveCategory', UserController.saveCategory );
api.get( '/getEventsById/:id', UserController.getEventsById );
api.put( '/updateEvent/:id', UserController.updateEvent );
api.get( '/getOrganization', UserController.getOrganization );
api.get( '/getUserById/:id', UserController.getUserById );
api.put( '/updateUser/:id', UserController.updateUser );
api.get( '/getAllUsers', UserController.getAllUsers );
api.get( '/getTypeUsers/:type', UserController.getTypeUsers );
api.get( '/getTypes', UserController.getTypes );
api.post( '/saveType', UserController.saveType );





module.exports = api;
