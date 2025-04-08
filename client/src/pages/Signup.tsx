import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import "../styles/Login.css"; // Reusing the login styles

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="mimic-mike-home"></div>
      <div className="content-wrapper">
        <div className="login-page">
          <div className="login-container">
            {data ? (
              <div className="success-message">
                <p>Success! You may now head back to the homepage.</p>
                <Link to="/">Go to Home</Link>
              </div>
            ) : (
              <>
                <h2 className="login-title">Sign Up</h2>
                <form onSubmit={handleFormSubmit}>
                  <input
                    className="form-input"
                    placeholder="Your username"
                    name="username"
                    type="text"
                    value={formState.username}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-input"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-input"
                    placeholder="Your password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    required
                    minLength={5}
                  />
                  <button className="login-btn" type="submit">
                    Sign Up
                  </button>
                </form>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Login here
                  </Link>
                </p>
              </>
            )}

            {error && <div className="error-message">{error.message}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
