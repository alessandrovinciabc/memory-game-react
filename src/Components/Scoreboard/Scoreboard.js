import React from 'react';

import './Scoreboard.css';

function Scoreboard(props) {
  return (
    <div className="Scoreboard">
      <div className="Score">Score: {props.score}</div>
      <div className="Best">Best: {props.best}</div>
    </div>
  );
}

export default Scoreboard;
