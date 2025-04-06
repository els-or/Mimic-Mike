import { useQuery } from '@apollo/client';
import { QUERY_GAME_SESSIONS } from '../utils/queries'; 

const ScoreboardPage = () => {
  const { loading, error, data } = useQuery(QUERY_GAME_SESSIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Scoreboard</h2>
      <ul>
        {data.gameSessions.map((score: { _id: string; player: { username: string }; score: number }) => (
          <li key={score._id}>
            <span>{score.player.username}</span>: <span>{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreboardPage;
