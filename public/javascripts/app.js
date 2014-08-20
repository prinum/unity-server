$(function(){
  var $up_button = $('#up_button');
  var $down_button = $('#down_button');
  var $notice = $('#notice');
  var $enemy = $('#enemy');
  var socket = io.connect();

  $up_button.on('click', function(){
    console.log('up');
    socket.emit('up');
  });

  $down_button.on('click', function(){
    console.log('down');
    socket.emit('down');
  });

  socket.on('enemy', function(mes){
    console.log('enemy:', mes);
    $enemy.append('<div>' + mes + '</div>');
  });

  // var socket = io.connect('http://localhost');
  // socket.on('news', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  // });
  socket.on('newPlayer', function() {
    $notice.html('新しい敵が入りました');
  });

  socket.on('otherDisconnect', function() {
    $notice.html('敵が切断しました');
  });

  socket.on('disconnect', function() {
    $notice.html('サーバーから切断されました');
  });
});
