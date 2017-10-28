'use strict'

//modulos
const BCRYPT = require( 'bcrypt-nodejs' );
const fs = require( 'fs' );
const path = require( 'path' );

//modelos
const User = require( '../models/user' );
const Events = require( '../models/events' );

//servicios jwt-simple
var jwt = require( '../services/jwt' );

//Funciones
function TypeEvents( req, res ){
  var params = req.body;
  console.log(params);
  var tipo = params.type;
  console.log(tipo);
  Events.find({ tipo: tipo }, ( err, typeEvent) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al buscar el tipo de evento' });
    }else {
      if (typeEvent) {
        console.log(typeEvent);
        res.status(200).send({ typeEvent });
      }else {
        res.status(404).send({ message: 'Los eventos de este tipo no se encontraron' });
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

function getImageFile( req, res) {
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

function getIconFile( req, res) {
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
    && params.ubicacion.nombre && params.ubicacion.lat && params.ubicacion.long ) {
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
  if (params.password && params.name && params.lastname && params.email && params.fono && params.ubicacion) {
    user.name = params.name;
    user.lastname = params.lastname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.foto = '';
    user.fono = params.fono;
    user.ubicacion = params.ubicacion;

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
                    res.status(200).send({ user: userStored })

                  }
                }
              });
          });
        }else {
          res.status(200).send({ message: 'El usuario no se puede registrar' });
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

function updateUser( req, res ){
  var userId = req.params.id;
  var update = req.body;


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

//Exportar
module.exports = {
  getEvents,
  saveUser,
  login,
  updateUser,
  uploadImg,
  getImageFile,
  getIconFile,
  TypeEvents,
  saveEvent
};
