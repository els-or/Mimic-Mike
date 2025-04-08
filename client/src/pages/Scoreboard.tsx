import { useQuery } from "@apollo/client";
import { QUERY_USERS_HIGH_SCORES } from "../utils/queries";
import "../styles/Home.css"; // For the base styling
import "../styles/Scoreboard.css"; // For scoreboard-specific styling

const ScoreboardPage = () => {
  const { loading, error, data } = useQuery(QUERY_USERS_HIGH_SCORES);
  const MAX_LEADERBOARD_ENTRIES = 15; // max entries to display

  // Get placement badge for rankings
  const getPlacementBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="place-badge gold">1st</span>;
      case 1:
        return <span className="place-badge silver">2nd</span>;
      case 2:
        return <span className="place-badge bronze">3rd</span>;
      default:
        return <span className="place-badge">{index + 1}</span>;
    }
  };

  return (
    <>
      <div className="mimic-mike-home"></div>
      <div className="content-wrapper">
        <div className="home-container">
          <div className="title-animation">
            <h1>Leaderboard</h1>
            <p className="tagline">Top Memory Masters of Mimic Mike</p>
          </div>

          <div className="leaderboard-container full-leaderboard">
            <h3 className="leaderboard-title">Global Rankings</h3>

            {loading ? (
              <div className="loading-state">
                <p>Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error loading leaderboard: {error.message}</p>
              </div>
            ) : !data || !data.users || data.users.length === 0 ? (
              <div className="empty-state">
                <p>No scores available yet. Be the first to play!</p>
              </div>
            ) : (
              <div className="leaderboard-entries">
                {[...data.users]
                  .sort((a, b) => b.highScore - a.highScore)
                  .slice(0, MAX_LEADERBOARD_ENTRIES)
                  .map((user, index) => (
                    <div key={user._id} className="leaderboard-entry">
                      {getPlacementBadge(index)}
                      <div className="entry-details">
                        <span className="player-name">{user.username}</span>
                        <span className="player-score">{user.highScore}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreboardPage;
