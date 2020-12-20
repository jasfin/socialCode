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
        //when FE emits a join_room event its detected here and we create a chat-room in the socket
        socket.on('join_room', function(data){
            console.log('received a joining request:', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });
        //when FE emits a send_message event, that message is broadcasted to all users in that chatroom
        socket.on('send_message', function(data){
            console.log('sending the message:',data);
            io.in(data.chatroom).emit('receive_message', data);
        });
    });
}