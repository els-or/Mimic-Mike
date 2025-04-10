import { ConnectedSocket, OnConnect, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from 'socket.io';

@SocketController()
export class MainController {
    @OnConnect()
    public onConnection(
        @ConnectedSocket() socket: Socket, 
        @SocketIO() _io: Server
    ) {
        console.log('New Socket connected: ', socket.id)
    }
}

