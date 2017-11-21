'use strict'

//modulos
const BCRYPT = require( 'bcrypt-nodejs' );
const fs = require( 'fs' );
const path = require( 'path' );

//modelos
const User = require( '../models/user' );
const Events = require( '../models/events' );
const Catergories = require( '../models/categories' );
const Location = require( '../models/location' );
const Locations = require( '../models/location' );

//servicios jwt-simple
var jwt = require( '../services/jwt' );

//Funciones
function validateUser( req, res ){
  var userId = req.params.userId;
  var update = req.body

  User.findByIdAndUpdate( userId, update, ( err, validate ) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al validar el usuario' });
    }else {
      if (validate) {
        res.status(200).send({ message: 'Usuario validado' });
      }else {
        res.status(404).send({ message: 'El usuario no se pudo validar' });
      }
    }
  });
}

function removeUser( req, res ){
  var userId = req.params.userId;

  User.findByIdAndRemove( userId, ( err, remove ) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al remover el usuario' });
    }else {
      if (remove) {
        res.status(200).send({ user: remove, message: 'Usuario eliminado' });
      }else {
        res.status(404).send({ message: 'El usuario no se pudo eliminar' });
      }
    }
  });
}

function getUsers( req, res ){
  var state = false;
  User.find({ state: state }, ( err, stateUser ) => {
    if (err) {
      res.status(500).send({ message: 'Error al buscar el estado del usuario' });
    }else {
      if (stateUser) {
        res.status(200).send({ user: stateUser, message: 'Usuarios no validados' });
      }else {
        res.status(404).send({ message: 'No hay solicitudes de registro' });
      }
    }
  });
}

function getEvents( req, res ){
  var path_file = './img/imagenes/';

  Events.find({}).exec(( err, events ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !events ) {
         res.status(404).send({ message: 'No hay eventos' })
       }else {
         res.status(200).send({ events })
         console.log(events[0]);
       }
     }
  });
}

function getImageFile( req, res ) {
  var imageFile = req.params.imageFile;
  var path_file = './img/imagenes/'+imageFile;

  fs.exists( path_file, function( exists ){
      if (exists) {
        res.sendFile( path.resolve( path_file ));
      }else {
        res.status(404).send({ message: 'No existe' });
      }
  });
}

function getIconFile( req, res ) {
  var iconFile = req.params.iconFile;
  var path_file = './img/icono/'+iconFile;

  fs.exists( path_file, function( exists ){
      if (exists) {
        res.sendFile( path.resolve( path_file ));
      }else {
        res.status(404).send({ message: 'No existe' });
      }
  });
}

function saveEvent( req, res ){
  //Crear Objeto user
  var event = new Events();

  //Tomar parametros
  var params = req.body;

  //Asignar valores al objeto de usuario
  if ( params.name && params.descripcion && params.org && params.fecha_inicio
    && params.fecha_termino && params.icon && params.tipo && params.image
    && params.ubicacion.nombre && params.ubicacion.lat && params.ubicacion.long && params.fono) {
    event.name = params.name;
    event.descripcion = params.descripcion;
    event.org = params.org;
    event.fecha_inicio = params.fecha_inicio;
    event.fecha_termino = params.fecha_termino;
    event.icon = params.icon;
    event.tipo = params.tipo;
    event.image = params.image;
    event.ubicacion.nombre = params.ubicacion.nombre;
    event.ubicacion.lat = params.ubicacion.lat;
    event.ubicacion.long = params.ubicacion.long;
    event.fono = params.fono;

    event.save(( err, eventStored) => {
      if ( err ) {
        res.status(500).send({ message: 'Error al guardar el evento' });
      }else {
        if ( !eventStored ) {
          res.status(404).send({ message: 'No se ha registrado el evento' });
        }else {
          res.status(200).send({ events: eventStored, message: 'Evento guardado correctamentede'})
        }
      }
    });
  }else {
    res.status(200).send({ message: 'Introduce los datos correctamente' });
  }
}

function saveUser( req, res ){
  //Crear Objeto user
  var user = new User();

  //Tomar parametros
  var params = req.body;

  //Asignar valores al objeto de usuario
  if (params.password && params.name && params.descripcion && params.email && params.fono && params.ubicacion && params.foto) {
    user.name = params.name;
    user.descripcion = params.descripcion;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.fono = params.fono;
    user.ubicacion = params.ubicacion;
    user.foto = params.foto;
    user.state = false;

    User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
      if (err) {
        res.status(500).send({ message: 'Error al comprobar el usuario' })
      }else{
        if(!issetUser){
          //Cifrar contraseña
          BCRYPT.hash(params.password, null, null, function( err, hash ){
              user.password = hash;
              user.save(( err, userStored) => {
                if ( err ) {
                  res.status(500).send({ message: 'Error al guardar usuario' });
                }else {
                  if ( !userStored ) {
                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                  }else {
                    res.status(200).send({ user: userStored, message: 'Registro completado' })
                  }
                }
              });
          });
        }else {
          res.status(200).send({ message: 'Ese correo ya se encuentra registrado' });
        }
      }
    });
  }else {
    res.status(200).send({ message: 'Introduce los datos correctamente' });
  }
}

function login( req, res ){
  var params = req.body;

  var name = params.name;
  var password = params.password;

  User.findOne({ name: name.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error al comprobar el usuario' });
    }else{
      if(user){
        BCRYPT.compare( password, user.password, ( err, check ) => {
          if (check) {
            // Comprobar tokken
            if (params.gettoken) {
              res.status(200).send({
                token:jwt.createToken( user )
              });
            }else {
              res.status(200).send({ user });
            }

          }else {
            res.status(404).send({ message: 'El usuario no ha podido conectarse correctamente' });
          }
        });
      }else {
        res.status(404).send({ message: 'El usuario no ha podido conectarse' });
      }
    }
  });

}


function uploadImg( req, res ) {
  // var userId = req.params.id;
  var file_name = 'No subido..';
  if ( req.files ) {
    var file_path = req.files.image.path;
    console.log(file_path);
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split( '\.' );
    var file_ext = ext_split[1];

    // res.status(200).send({
    //   file_path: file_path,
    //   file_split: file_split,
    //   file_name: file_name,
    //   ext_split: ext_split,
    //   file_ext: file_ext
    // });

    if ( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ) {
      // if (userId != req.user.sub) {
      //   res.status(500).send({ message: 'no tienes permisos para actualizar el usuario' })
      // }

      Events.find( { image: file_name }, { new:true }, ( err, eventUpdated ) => {
        if (err) {
          res.status(500).send({ message: 'Error al actualizar usuario' });
        }else {
          if (!eventUpdated) {
            console.log(eventUpdated);
            res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
          }else {
            res.status(200).send({ events: eventUpdated, image: file_name });
          }
        }
      });
    }else {
      res.status(200).send({ message: 'Extension no valida' })
    }


  }else {
    res.status(200).send({ message: 'No se ha subido la imagen  ' })
  }
}

function uploadIcon( req, res ) {
  var file_name = 'No subido..';
  if ( req.files ) {
    var file_path = req.files.image.path;
    console.log(file_path);
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split( '\.' );
    var file_ext = ext_split[1];

    if ( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ) {
      Events.find( { image: file_name }, { new:true }, ( err, eventUpdated ) => {
        if (err) {
          res.status(500).send({ message: 'Error al actualizar usuario' });
        }else {
          if (!eventUpdated) {
            console.log(eventUpdated);
            res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
          }else {
            res.status(200).send({ events: eventUpdated, image: file_name });
          }
        }
      });
    }else {
      res.status(200).send({ message: 'Extension no valida' })
    }
  }else {
    res.status(200).send({ message: 'No se ha subido la imagen  ' })
  }
}

function getEventsByOrg( req, res ){
  var org = req.params.org;

  Events.find({ org: org }).exec(( err, events ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !events ) {
         res.status(404).send({ message: 'No hay eventos de esta organización' })
       }else {
         res.status(200).send({ events })
       }
     }
  });
}

function removeEvent( req, res ){
  var eventId = req.params.eventId;

  Events.findByIdAndRemove( eventId, ( err, remove ) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al eliminar el evento' });
    }else {
      if (remove) {
        res.status(200).send({ event: remove, message: 'Evento eliminado' });
      }else {
        res.status(404).send({ message: 'El event no se pudo eliminar' });
      }
    }
  });
}

function getEventsBySpace( req, res ){
  var space = req.params.space;

  Events.find({ 'ubicacion.nombre': space }).exec(( err, events ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !events ) {
         res.status(404).send({ message: 'No hay eventos en este lugar' })
       }else {
         res.status(200).send({ events })
       }
     }
  });
}

function getEventsByType( req, res ){
  var type = req.params.type;

  Events.find({ tipo: type }).exec(( err, events ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !events ) {
         res.status(404).send({ message: 'Los eventos de este tipo no se encontraron' })
       }else {
         res.status(200).send({ events })
       }
     }
  });
}

function getCategories( req, res ){

  Catergories.find({}).exec(( err, categories ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !categories ) {
         res.status(404).send({ message: 'Las categorias no se encontraron' })
       }else {
         res.status(200).send({ Catergories: categories })
       }
     }
  });
}

function saveLocation( req, res ){
  //Crear Objeto
  var location = new Location();

  //Tomar parametros
  var params = req.body;

  if ( params.name && params.lat && params.lng ) {
    location.name = params.name;
    location.lat = params.lat;
    location.lng = params.lng;

    Location.findOne({ name: location.name.toLowerCase() }, (err, issetLocation) => {
      if (err) {
        res.status(500).send({ message: 'Error al comprobar el lugar' })
      }else{
        if(!issetLocation){
          location.save(( err, loc) => {
            if ( err ) {
              res.status(500).send({ message: 'Error al guardar la ubicacion' });
            }else {
              if ( !loc ) {
                res.status(404).send({ message: 'No se ha registrado el lugar' });
              }else {
                res.status(200).send({ location: loc, message: 'Registro completado' })
              }
            }
          });
        }else {
          res.status(200).send({ message: 'Ese lugar ya se encuentra registrado' });
        }
      }
    });
  }else {
    res.status(200).send({ message: 'Introduce los datos correctamente' });
  }
}

function getLocations( req, res ){

  Locations.find({}).exec(( err, locations ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !locations ) {
         res.status(404).send({ message: 'No se encontraron datos' })
       }else {
         res.status(200).send({ Locations: locations })
       }
     }
  });
}

function saveCategory( req, res ){
  //Crear Objeto
  var categories = new Catergories();

  //Tomar parametros
  var params = req.body;

  if ( params.actividades  ) {
    categories.actividades = params.actividades.toUpperCase();

    Catergories.findOne({ actividades: categories.actividades }, (err, issetCategory) => {
      if (err) {
        res.status(500).send({ message: 'Error al comprobar el lugar' })
      }else{
        if(!issetCategory){
          categories.save(( err, cat) => {
            if ( err ) {
              res.status(500).send({ message: 'Error al guardar la categoria' });
            }else {
              if ( !cat ) {
                res.status(404).send({ message: 'No se ha registrado la categoria' });
              }else {
                res.status(200).send({ categories: cat, message: 'Registro completado' })
              }
            }
          });
        }else {
          res.status(200).send({ message: 'Esa categoria ya se encuentra registrada' });
        }
      }
    });
  }else {
    res.status(200).send({ message: 'Introduce los datos correctamente' });
  }
}

function getEventsById( req, res ){
  var id = req.params.id;

  Events.findById( id, ( err, events ) => {
     if( err ){
       res.status(500).send({ message: 'Error la petición' })
     }else {
       if ( !events ) {
         res.status(404).send({ message: 'El evento no existe' })
       }else {
         res.status(200).send({ events })
       }
     }
  });
}

function updateEvent( req, res ){
  var eventId = req.params.id;
  var update = req.body;

  Events.findByIdAndUpdate( eventId, update, ( err, validate ) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al buscar el evento' });
    }else {
      if (validate) {
        res.status(200).send({ message: 'Evento actualizado' });
      }else {
        res.status(404).send({ message: 'El evento no se pudo actualizar' });
      }
    }
  });
}

//Exportar
module.exports = {
  getEvents,
  saveUser,
  login,
  uploadImg,
  uploadIcon,
  getImageFile,
  getIconFile,
  getEventsByType,
  saveEvent,
  getUsers,
  validateUser,
  removeUser,
  getEventsByOrg,
  removeEvent,
  getEventsBySpace,
  getCategories,
  saveLocation,
  getLocations,
  saveCategory,
  getEventsById,
  updateEvent
};
