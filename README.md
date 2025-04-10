# Mimic Mike: Simon Says Multiplayer Game

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
MIT License. See `LICENSE` file for more details.

## Contributions and Contacts
### Lauren Moore
- GitHub: https://github.com/Lauren245
### Rachel Sutton
- GitHub: https://github.com/els-or
### Christian Walters
- GitHub: https://github.com/EnderJunk
### Tristin Tsun
- GitHub: https://github.com/Tsunwei514
