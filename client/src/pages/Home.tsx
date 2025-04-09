// import { useMutation, useQuery } from "@apollo/client";
// import { CREATE_GAME_SESSION, UPDATE_USER } from "../utils/mutations";
import { useQuery } from "@apollo/client";
import { QUERY_USERS } from "../utils/queries";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import "../styles/Home.css";

// Define a type for leaderboard entries
interface LeaderboardEntry {
  username: string;
  highScore: number;
}

const Home = () => {
 
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  console.log(highScore); 

  // Fetch all users for the leaderboard
  const { data: userData, loading: leaderboardLoading } = useQuery(QUERY_USERS);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("mimic-mike-highscore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    document.title = "Mimic Mike";
  }, []);

  // Process leaderboard data when it arrives
  useEffect(() => {
    if (userData && userData.users) {
      // Sort users by high score (descending)
      const sortedUsers = [...userData.users]
        .sort((a, b) => b.highScore - a.highScore)
        .slice(0, 3); // Get top 3

      setLeaderboard(sortedUsers);
    }
  }, [userData]);

  // Generate placement badges for leaderboard
  const getPlacementBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="place-badge gold">1st</span>;
      case 1:
        return <span className="place-badge silver">2nd</span>;
      case 2:
        return <span className="place-badge bronze">3rd</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mimic-mike-home"></div>
      <div className="content-wrapper">
        <div className="home-container">
          <div className="title-animation">
            <h1>Mimic Mike</h1>
            <p className="tagline">Test your memory and mimicry skills!</p>
          </div>

          <div className="game-info">
            <p>
              Follow Mike's patterns and repeat them back correctly to score
              points.
            </p>
            <p>How far can you go?</p>
          </div>

          <div className="leaderboard-container">
            <h3 className="leaderboard-title">Top Players</h3>
            {leaderboardLoading ? (
              <p>Loading leaderboard...</p>
            ) : leaderboard.length > 0 ? (
              <div className="leaderboard-entries">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="leaderboard-entry">
                    {getPlacementBadge(index)}
                    <div className="entry-details">
                      <span className="player-name">{entry.username}</span>
                      <span className="player-score">{entry.highScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No scores yet. Be the first!</p>
            )}
          </div>

          {!Auth.loggedIn() && (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <span>or</span>
              <Link to="/signup" className="signup-button">
                Sign Up
              </Link>
              <p>to save your scores!</p>
            </div>
          )}
          {Auth.loggedIn() && (
            <div className="auth-buttons">
              <Link to="/game" className="login-button">
                Single-Player
              </Link>
              <span>or</span>
              <Link to="/MultiPlayer" className="signup-button">
                Multi-Player
              </Link>
              <p>Test your skills!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
