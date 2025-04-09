import { ConnectedSocket, OnMessage, SocketController, SocketIO, MessageBody } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { generatePattern } from "./gameController.js";

import { MultiplayerSession } from "../models/index.js";

@SocketController()
export class SessionController {
    @OnMessage("join_game")
    public async joinGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any ) {
        console.log("New user joining game session: ", message)
        const connectedSockets = io.sockets.adapter.rooms.get(message.sessionId)
        const socketSessions = Array.from(socket.rooms.values()).filter((r) => r !== socket.id)

        if (socketSessions.length > 0 || connectedSockets && connectedSockets.size === 2) {
            socket.emit("session_join_error", {
                error: "Session is full, please choose another session."
            });
        } else {
            await socket.join(message.sessionId);
            socket.emit("session_joined");

            if (connectedSockets && connectedSockets.size === 2) {
                const startingPattern = generatePattern(4)
                console.log(socket.id)
                console.log(startingPattern)
                // Emit to the first player
                socket.emit("start_game", { options: { start: false, player: 2, startingPattern: startingPattern } })
                // Emit to the second player    
                socket.to(message.sessionId).emit("start_game", { options: { start: true, player: 1, startingPattern: startingPattern } })
                const result = await MultiplayerSession.deleteMany({ sessionId: message.sessionId })
                console.log("Deleted session: ", result)
            } else {
                MultiplayerSession.create(
                    { sessionId: message.sessionId },)
            }
        }
    }
}