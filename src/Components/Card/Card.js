import React from 'react';

import './Card.css';

function Card(props) {
  return (
    <div className="Card">
      <img className="Card__image" src={props.img} alt="" />
    </div>
  );
}

export default Card;
