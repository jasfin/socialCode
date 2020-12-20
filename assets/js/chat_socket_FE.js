//this is the client side socket part where client establishes the connection
class ChatEngine{
    constructor(chatBoxId, userEmail, userName){
        console.log('inside constructor');
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

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
        let self = this;
        //after the io.connect() call is detected on server side, server sends an acknowledgement which is caught here
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'socialCode',
                user_name: self.userName
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
                //below code is to inform all members of the chatroom that a new member joined
                let newMessage = $('<li>');                
                if (data.user_email != self.userEmail){
                    let messageType = 'other-message';
                    newMessage.append($('<span>', {
                        'html': `${data.user_name} has joined the chat`
                    }));
                    newMessage.append($('<sub>', {
                        'html': data.user_name
                    }));
                    newMessage.addClass(messageType);
                    $('#chat-messages-list').append(newMessage);                   
                }       

            })
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if (msg!=''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chatroom: 'socialCode'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received is:', data.message);
            let newMessage = $('<li>');
            let messageType = 'other-message';
            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }
            newMessage.append($('<span>', {
                'html': data.message
            }));
            newMessage.append($('<sub>', {
                'html': data.user_name
            }));
            // id='message-holder'
            newMessage.addClass(messageType);
            let newDivMsg = $("<div>",{
                id:messageType
            });
            newDivMsg.append(newMessage);
            $('#chat-messages-list').append(newDivMsg);
        });
    }
}