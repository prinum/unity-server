var OscEmitter = require('osc-emitter');
var emitter = new OscEmitter();

var States = {
  up: 1,
  down: 2,
  connect: 3,
  disconnect: 4
};

var Setting = {
  maxUsers: 2
};

var UnityConf = {
  host: '0.0.0.0',
  port: 6666
};

emitter.add(UnityConf.host, UnityConf.port);

function appIo(app, server) {
  var io = require('socket.io')(server);
  app.locals.currentUsers = 0; // redisで管理した方がいいかも

  io.on('connection', function (socket) {
    console.log('socket.id: ', socket.id);
    
    function emitOtherPlayer(key, data) {
      var userIds = Object.keys(io.sockets.adapter.rooms);
      var otherIds = userIds.filter(function(v){
        return v != socket.id;
      });

      otherIds.forEach(function(otherId){
        socket.to(otherId).emit(key, data);
      });
    }
    
    if (app.locals.currentUsers >= Setting.maxUsers) {
      socket.disconnect();
    } else {
      app.locals.currentUsers += 1;
      emitOtherPlayer('newPlayer', '');
      emitter.emit(socket.id, States.connect);
    }

    socket.on('up', function(){
      console.log('up: ', socket.id);
      emitOtherPlayer('enemy', 'up');
      emitter.emit(socket.id, States.up);
    });

    socket.on('down', function(){
      console.log('down: ', socket.id);
      emitOtherPlayer('enemy', 'down');
      emitter.emit(socket.id, States.down);
    });

    socket.on('disconnect', function () {
      app.locals.currentUsers -= 1;
      emitOtherPlayer('otherDisconnect', '');
      emitter.emit(socket.id, States.disconnect);
    });
  });

  return io;
}

module.exports = appIo;
