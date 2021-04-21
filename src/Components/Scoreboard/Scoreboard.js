import React from 'react';

import './Scoreboard.css';

function Scoreboard(props) {
  return (
    <div className="Scoreboard">
      <div className="Score">Score: {props.score}</div>
      <div className="Best">Best: {props.best}</div>
      {props.hasWon ? <h1>You won!</h1> : null}
    </div>
  );
}

export default Scoreboard;
