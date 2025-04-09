import { Socket } from "socket.io-client";

interface gameOptions {
    start: boolean
    player: 1 | 2
    startingPattern: string[]
}
class GameService {

    public async joinGameSession (socket: Socket, sessionId: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit("join_game", { sessionId });
            socket.on("session_joined", () => rs(true));
            socket.on("session_join_error", ({ error }) => rj(error));
        })
    }

    public async updateGame(socket: Socket, gameStatus: any) {
        socket.emit("update_game", { gameStatus: gameStatus})
    }

    public async onGameUpdate(socket: Socket, listener: (gameStatus: any) => void ) {
        socket.on("on_game_update", ({ gameStatus }) => listener(gameStatus))
    }

    public async onStartGame(socket: Socket, listener: (options: gameOptions) => void) {
        socket.on("start_game", ({ options }) => {console.log("start_game received"); listener(options)})
        socket.on("start_game_second_player", ({ options }) => {console.log("start_game_second_player received"); listener(options)})
    }

    public async onUpdateSessionList(socket: Socket, listener: (sessionList: string[]) => void) {
        socket.on("update_session_list", ({ sessionList }) => listener(sessionList))
    }

    public async updateSessionList(socket: Socket, sessionList: string[]) {
        socket.emit("update_session_list", { sessionList })
    }
}

export default new GameService();
