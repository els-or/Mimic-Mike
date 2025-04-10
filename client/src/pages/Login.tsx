import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import "../styles/Login.css";

const Login = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

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
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      email: "",
      password: "",
    });
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
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleFormSubmit}>
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
                  />
                  <button className="login-btn" type="submit">
                    Login
                  </button>
                </form>
                <p>
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="login-link">
                    Sign up here
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

export default Login;
