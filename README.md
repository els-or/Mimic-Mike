# Mimic Mike: Simon Says Multiplayer Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) - https://opensource.org/licenses/MIT

## Table of Contents
[Description](#description)

[Features](#features)

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Frontend](#frontend)

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Backend](#backend)

[Installation](#installation)

[Future Enhancements](#future-enhancements)

[License](#license)

[Contributions and Contacts](#contributions-and-contacts)

[Screenshots](#screenshots)

[Render Deployed Version](#render-deployed-version)

## Description

This is a real-time, multiplayer version of the classic Simon Says game built with React, Apollo Client, Socket.io, MongoDB, and GraphQL. The game allows users to create sessions, join multiplayer games, or play solo. In both modes, players can compete in rounds by matching a growing sequence of colors that the game generates. Players take turns following the sequence, and the game progresses with increasing difficulty. 

## Features

- Authentication: Players can sign up, log in, and view their profiles and leaderboard scores.
- Score tracking: Scores are updated and displayed for each player.
- Game Progression: As players correctly match the color pattern, the game progresses, and the pattern grows.
- Pattern Generation: The game generates random color patterns each round for players to replicate.
- Multiplayer Support: Users can create or join game sessions with a maximum of two players.

### Frontend
- React
- Apollo Client
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- GraphQL
- dotevn
- JWT Authentication
- Socket.io

## Installation

### Setup
1. **Clone the Repository**
   ```sh
   git clone https://github.com/els-or/Mimic-Mike.git
   cd MIMIC-MIKE
   ```
2. **Install Backend Dependencies**
   ```sh
   cd server
   npm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` file in the `backend` directory and add:
   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   ```
4. **Start the Backend Server**
   ```sh
   npm start
   ```
6. **Install Frontend Dependencies**
   ```sh
   cd ../frontend
   npm install
   ```
7. **Start the Frontend**
   ```sh
   npm start
   ```
## Future Enhancements
- Improving "error handling"
- More gameboard themes and styles!
- Adding more players to multiplayers as well as additional gamemodes!
- More control over accounts and their data
- Chiense localization

## License
**&copy;2025 The Dream Team**

This software uses an [MIT license](https://opensource.org/license/MIT). 

See `LICENSE` file for more details.

## Contributions and Contacts
### Lauren Moore
- GitHub: https://github.com/Lauren245
### Rachel Sutton
- GitHub: https://github.com/els-or
### Christian Walters
- GitHub: https://github.com/EnderJunk
### Tristin Tsun
- GitHub: https://github.com/Tsunwei514

## Screenshots

**Image of the main menu with the leaderboard**

![Screenshot of the Mimic Mike game's main menu. The screen features the game title "Mimic Mike" at the top, with a description prompting users to test their memory and mimicry skills. A leaderboard shows the top three players: SunnyScribe and Blaklazer tied with 7 points, and JollyGuru with 0 points. Below the leaderboard are buttons for "Login" and "Sign Up" to save scores. The background has a gradient from deep purple to orange.](./assets/screenshots/Mimic-Mike-Main-Menu.png)



**Image of the single player mode**

![Screenshot of the Mimic Mike game in progress. The screen shows "Round 3" at the top with a score of 2. In the center is a circular four-button controller labeled A (red), B (blue), C (green), and D (orange), with the number 3 displayed in the middle. There is a "Quit Game" button below. The background has a gradient from deep purple to orange, and the top navigation includes "Profile," "Leaderboard," and a "Logout" button.](./assets/screenshots/Mimic-Mike-Single-Player.png)


## Render Deployed Version
[Click here](https://mimic-mike.onrender.com/) to view the app as deployed on Render.

---
**[Back to Top](#mimic-mike-simon-says-multiplayer-game)**