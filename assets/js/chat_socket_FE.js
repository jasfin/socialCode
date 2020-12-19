//this is the client side socket part where client establishes the connection
class ChatEngine{
    constructor(chatBoxId, userEmail){
        console.log('inside constructor');
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //io.connect will emit an event connection which is detected in the backend socket part
        //this.socket = io.connect('http://localhost:5000');
        console.log('trying to connect');
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        };
        this.socket = io.connect('http://localhost:5000',connectionOptions);
        //this.socket = io('http://localhost:5000', { transport : ['websocket'] });
        console.log('finished connect');
        if (this.userEmail){
            this.connectionHandler();
        }

    }

    
    connectionHandler(){
        //after the io.connect() call is detected on server side, server sends an acknowledgement which is caught here
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');
        });
    }
}