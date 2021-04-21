import React, { useState, useEffect } from 'react';

import './App.css';

import Scoreboard from '../Scoreboard/Scoreboard.js';
import Card from '../Card/Card.js';

function App() {
  let [score, setScore] = useState(0);
  let [best, setBest] = useState(0);

  return (
    <div className="App">
      <Scoreboard score={score} best={best} />
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
