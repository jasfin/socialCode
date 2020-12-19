//this is the server side observer that observed the client messages
module.exports.chatSocket = function(socketServer){
    let io = require('socket.io')(socketServer);
    //when client sends a connect event , its detected here.., after detecting it sends back an acknowledgement that is
       //detected inside - this.socket.on('connect' on the client side
    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);
        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });
    });
}