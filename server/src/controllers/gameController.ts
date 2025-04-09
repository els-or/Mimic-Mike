import { ConnectedSocket, OnMessage, SocketController, SocketIO, MessageBody } from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {
    private getSocketGameSession(socket: Socket): string {
        const socketSessions = Array.from(socket.rooms.values()).filter((r) => r !== socket.id)
        const gameSession = socketSessions && socketSessions[0]

        return gameSession;
    }

    @OnMessage("update_game")
    public async updateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any ) {
        const gameSession = this.getSocketGameSession(socket)
        if (message.gameStatus.roundEnd) {
            console.log("Round end message received", message)
            const patternMessage = {
                gameStatus: {
                    newPattern: generatePattern(message.gameStatus.round + 3),
                }
            }
            io.to(gameSession).emit("on_game_update", patternMessage)
        }
        if (message.gameStatus.gameOver) {
                io.to(gameSession).emit("on_game_update", message)
        } else {
            socket.to(gameSession).emit("on_game_update", message)
        }
    }

    @OnMessage("update_session_list")
    public async updateSessionList(@SocketIO() io: Server, @ConnectedSocket() _socket: Socket, @MessageBody() message: any ) {
        io.emit("update_session_list", message)
        console.log("Session list updated: ", message)
    }
}

export const generatePattern = (round: number): string[] => {
    const colorIndex = {
        1: "red",
        2: "blue",
        3: "yellow",
        4: "green"
    }
    return Array.from({length: round}, () => {
        const index: keyof typeof colorIndex = Math.floor(Math.random() * 4 + 1) as keyof typeof colorIndex
        return colorIndex[index]
    });
}