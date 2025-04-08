import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ScoreboardPage from "./pages/Scoreboard";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/Error";
import GameBoard from "./pages/GameBoard.js";
import MultiplayerGame from "./pages/MultiplayerGame.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/profiles/:username",
        element: <Profile />,
      },
      {
        path: "/me",
        element: <Profile />,
      },
      {
        path: "/leaderboard",
        element: <ScoreboardPage />,
      },
      {
        path: "/game",
        element: <GameBoard />,
      },
      {
        path: "/MultiPlayer",
        element: <MultiplayerGame />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
