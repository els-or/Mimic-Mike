export interface GameSession {
    _id: string;
  player: {
    _id: string;
    username: string;
  };
  score: number;
}