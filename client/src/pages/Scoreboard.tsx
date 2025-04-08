import { useQuery } from '@apollo/client';
import { QUERY_USERS_HIGH_SCORES } from '../utils/queries';

const ScoreboardPage = () => {
  const { loading, error, data } = useQuery(QUERY_USERS_HIGH_SCORES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Ensure data.users is defined and not empty
  if (!data || !data.users || data.users.length === 0) {
    return <p>No scores available.</p>;
  }

  // Sort users by high score in descending order
  const sortedUsers = [...data.users].sort((a: { highScore: number }, b: { highScore: number }) => b.highScore - a.highScore);

  return (
    <div>
      <h2>Scoreboard</h2>
      <ul>
        {sortedUsers.map((user: { _id: string; username: string; highScore: number }) => (
          <li key={user._id}>
            <span>{user.username}</span>: <span>{user.highScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreboardPage;
