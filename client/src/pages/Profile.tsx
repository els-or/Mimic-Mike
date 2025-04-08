import { useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USERS, QUERY_ME } from "../utils/queries";
import { CREATE_GAME_SESSION } from "../utils/mutations";
import Auth from "../utils/auth";
import "../styles/Profile.css";

const Profile = () => {
  const { username: userParam } = useParams();
  const [gameStarted, setGameStarted] = useState(false);

  // For creating a game session
  const [createGameSession] = useMutation(CREATE_GAME_SESSION);

  const { loading, data } = useQuery(userParam ? QUERY_USERS : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  // Redirect if logged in and trying to access their own profile page
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  const startGame = async () => {
    try {
      const { data } = await createGameSession({ variables: { score: 0 } });
      console.log("Game session created:", data);
      setGameStarted(true);
      window.location.assign("/game");
    } catch (error) {
      console.error("Error creating game session:", error);
    }
  };

  if (loading) {
    return (
      <>
        <div className="mimic-mike-home"></div>
        <div className="content-wrapper">
          <div className="profile-page">
            <div className="profile-container">
              <div className="loading">Loading...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!Auth.loggedIn()) {
    return (
      <>
        <div className="mimic-mike-home"></div>
        <div className="content-wrapper">
          <div className="profile-page">
            <div className="profile-container">
              <div className="not-logged-in">
                <h2>You need to be logged in to see this page</h2>
                <p>Please login or sign up to access your profile.</p>
                <div className="auth-links">
                  <Link to="/login" className="login-button">
                    Login
                  </Link>
                  <Link to="/signup" className="signup-button">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mimic-mike-home"></div>
      <div className="content-wrapper">
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-header">
              <h2 className="profile-title">
                {userParam ? `${user.username}'s Profile` : "Your Profile"}
              </h2>
              <p className="profile-subtitle">
                {userParam ? "View player stats" : "Welcome back!"}
              </p>
            </div>

            <div className="profile-content">
              <div className="stats-card">
                <h3 className="stats-title">Player Stats</h3>
                <div className="stat-row">
                  <span className="stat-label">Username</span>
                  <span className="stat-value">{user.username}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">High Score</span>
                  <span className="stat-value">{user.highScore}</span>
                </div>
                {user.email && !userParam && (
                  <div className="stat-row">
                    <span className="stat-label">Email</span>
                    <span className="stat-value">{user.email}</span>
                  </div>
                )}
              </div>

              {!userParam && (
                <button className="play-now-btn" onClick={startGame}>
                  Play Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
