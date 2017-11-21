function getByOrg( req, res ){
  var org = req.params.org;

  Events.find({ org: org }, ( err, orgEvent) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al buscar los eventos de esta organización' });
    }else {
      if (orgEvent) {
        res.status(200).send({ orgEvent });
      }else {
        res.status(404).send({ message: 'Los eventos de esta organización no se encontraron' });
      }
    }
  });
}

function getBySpace( req, res ){
  var space = req.params.space;

  Events.find({ ubicacion.nombre: space }).exec()( err, spaceEvent) => {
    if ( err ) {
      res.status(500).send({ message: 'Error al buscar los eventos que ocurren en este lugar ' });
    }else {
      if (spaceEvent) {
        res.status(200).send({ spaceEvent });
      }else {
        res.status(404).send({ message: 'No hay evento en este lugar' });
      }
    }
  });
}


function getEventsOf( req, res ){
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
