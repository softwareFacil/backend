'use strict'

//modulos
const BCRYPT = require('bcrypt-nodejs');

//modelos
const User = require( '../models/user' );

//servicios jwt-simple
var jwt = require( '../services/jwt' );

//Funciones
function pruebas( req, res ){
  res.status(200).send({
    message: 'Probando controlador',
    user: req.user
  });

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

  if (userId != req.user.sub) {
    res.status(500).send({ message: 'no tienes permisos para actualizar el usuario' })
  }

  User.findByIdAndUpdate( userId, update, { new:true }, ( err, userUpdated ) => {
    if (err) {
      res.status(500).send({ message: 'Error al actualizar usuario' });
    }else {
      if (!userUpdated) {
        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
      }else {
        res.status(200).send({ user: userUpdated });
      }
    }
  })

}

//Exportar
module.exports = {
  pruebas,
  saveUser,
  login,
  updateUser
};
