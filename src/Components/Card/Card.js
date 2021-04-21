import React from 'react';

import './Card.css';

function Card(props) {
  return (
    <div className="Card" onClick={props.onClick}>
      <img draggable="false" className="Card__image" src={props.img} alt="" />
    </div>
  );
}

export default Card;
