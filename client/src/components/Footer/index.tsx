import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {location.pathname !== "/" && (
          <button
            className="back-button"
            onClick={handleGoBack}
            aria-label="Go back to previous page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </button>
        )}
        <div className="footer-text">
          <span className="copyright">© {currentYear} Mimic Mike</span>
          <span className="divider">|</span>
          <span className="credit">Made by the Dream Team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
