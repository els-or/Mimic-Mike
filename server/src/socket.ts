import { useSocketServer } from 'socket-controllers';
import { Server } from 'socket.io'

import { MainController } from './controllers/mainController.js';
import { SessionController } from './controllers/sessionController.js';
import { GameController } from './controllers/gameController.js';


const socket = (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
    useSocketServer(io, { controllers: [
        MainController,
        SessionController,
        GameController
    ] });
    console.log("Starting socket.io server")
    return io;
}

export default socket
