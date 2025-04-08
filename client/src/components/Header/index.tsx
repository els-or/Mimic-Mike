import { useState } from "react";
import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const logout = (event: MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();
    Auth.logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-glass">
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">Mimic Mike</span>
          </Link>
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar ${isMenuOpen ? "open" : ""}`}>
          {Auth.loggedIn() ? (
            <>
              <Link
                to="/profile"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/leaderboard"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
              
              <button
                className="logout-btn"
                onClick={(e) => {
                  logout(e);
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </button>
              <Link className="btn btn-lg btn-info m-2" to="/scoreboard">
                Scoreboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="nav-link signup"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
