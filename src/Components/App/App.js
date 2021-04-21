import React from 'react';

import './App.css';

import Scoreboard from '../Scoreboard/Scoreboard.js';
import Card from '../Card/Card.js';

function App() {
  return (
    <div className="App">
      <Scoreboard />
      <div className="Game">
        <Card />
        <Card />
        <Card />
      </div>
      <button className="Button--reset">Clear Highscore</button>
    </div>
  );
}

export default App;
