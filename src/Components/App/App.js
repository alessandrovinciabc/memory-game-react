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
  const N_OF_CARDS = 10;
  let [score, setScore] = useState(0);
  let [best, setBest] = useState(0);
  let [cardImages, setCardImages] = useState(Array(N_OF_CARDS).fill({}));
  let [currentCards, setCurrentCards] = useState(Array(3).fill({}));

  useEffect(() => {
    getImages(N_OF_CARDS).then((newImages) => {
      let arrayOfCardObjects = newImages.map((image) => {
        return {
          src: image,
          clicked: false,
        };
      });
      setCardImages(arrayOfCardObjects);
    });
  }, []);

  function onCardClick(e, index) {
    setCardImages((prev) => {
      if (prev[index].clicked) {
        setScore(0);
        return prev; //gameover
      }

      let copy = JSON.parse(JSON.stringify(prev));
      copy[index].clicked = true;

      setScore((score) => {
        setBest((best) => {
          if (score + 1 > best) return score + 1;
        });
        return score + 1;
      });

      return copy;
    });
  }

  return (
    <div className="App">
      <Scoreboard score={score} best={best} />
      <div className="Game">
        <Card
          img={cardImages[0].src}
          onClick={(e) => {
            onCardClick(e, 0);
          }}
        />
        <Card
          img={cardImages[1].src}
          onClick={(e) => {
            onCardClick(e, 1);
          }}
        />
        <Card
          img={cardImages[2].src}
          onClick={(e) => {
            onCardClick(e, 2);
          }}
        />
      </div>
      <button className="Button--reset">Clear Highscore</button>
    </div>
  );
}

export default App;
