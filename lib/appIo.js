var OscEmitter = require('osc-emitter')
  , emitter = new OscEmitter();

emitter.add('0.0.0.0', 6666);

function appIo(app, server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log('socket.id: ', socket.id);
    console.log('currentUsers:', app.locals.currentUsers);
    
    function emitOtherPlayer(key, data) {
      var userIds = Object.keys(io.sockets.adapter.rooms);
      var otherIds = userIds.filter(function(v){
        return v != socket.id;
      });

      otherIds.forEach(function(otherId){
        socket.to(otherId).emit(key, data);
      });
    }
    
    if (app.locals.currentUsers >= app.locals.maxUsers) {
      socket.disconnect();
    } else {
      app.locals.currentUsers += 1;
      emitOtherPlayer('newPlayer', '');
    }

    socket.on('up', function(){
      console.log('up: ', socket.id);
      emitOtherPlayer('enemy', 'up');
      emitter.emit('/foo', 'up');
      // TODO unity
    });

    socket.on('down', function(){
      console.log('down: ', socket.id);
      emitOtherPlayer('enemy', 'down');
      emitter.emit('/foo', 'down');
      // TODO unity
    });

    socket.on('disconnect', function () {
      app.locals.currentUsers -= 1;
      emitOtherPlayer('otherDisconnect', '');
    });
  });

  return io;
}

module.exports = appIo;
