import React, { useState, useEffect } from 'react';

import './App.css';

import Scoreboard from '../Scoreboard/Scoreboard.js';
import Card from '../Card/Card.js';

let getImages = async (n) => {
  let images = [];

  try {
    while (images.length < n) {
      let response = await fetch('https://randomfox.ca/floof/');
      let newImage = await response.json();

      if (images.indexOf(newImage.image) === -1) {
        images.push(newImage.image);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return images;
};

function App() {
  let [score, setScore] = useState(0);
  let [best, setBest] = useState(0);
  let [cardImages, setCardImages] = useState('');

  useEffect(() => {
    getImages(5).then((newImages) => {
      setCardImages(newImages);
    });
  }, []);

  return (
    <div className="App">
      <Scoreboard score={score} best={best} />
      <div className="Game">
        <Card img={cardImages[0]} />
        <Card img={cardImages[1]} />
        <Card img={cardImages[2]} />
      </div>
      <button className="Button--reset">Clear Highscore</button>
    </div>
  );
}

export default App;
