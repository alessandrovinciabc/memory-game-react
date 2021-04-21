import React, { useState, useEffect } from 'react';

import './App.css';

import Scoreboard from '../Scoreboard/Scoreboard.js';
import Card from '../Card/Card.js';

import { v4 as uuidv4 } from 'uuid';

let getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let shuffleArray = (arr) => {
  for (let i = 0; i < arr.length; ++i) {
    let firstIndex, secondIndex;
    let temp;

    firstIndex = getRandomNumber(0, arr.length - 1);
    secondIndex = getRandomNumber(0, arr.length - 1);

    temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
  }

  return arr;
};

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

  function shuffleUntilOneUnclicked() {
    setCardImages((cards) => {
      let copy = JSON.parse(JSON.stringify(cards));

      let newCurrent;
      let atLeastOneUnclickedCard = false;
      while (!atLeastOneUnclickedCard) {
        shuffleArray(copy);
        newCurrent = copy.slice(0, 3);

        if (newCurrent.filter((card) => !card.clicked))
          atLeastOneUnclickedCard = true;
      }

      setCurrentCards(newCurrent);

      return cards;
    });
  }

  useEffect(() => {
    getImages(N_OF_CARDS).then((newImages) => {
      let arrayOfCardObjects = newImages.map((image) => {
        return {
          id: uuidv4(),
          src: image,
          clicked: false,
        };
      });
      setCardImages(arrayOfCardObjects);
      shuffleUntilOneUnclicked();
    });
  }, []);

  function onCardClick(e, id) {
    setCardImages((prev) => {
      let correspondingCardIndex = prev.findIndex((el) => el.id === id);

      if (prev[correspondingCardIndex].clicked) {
        setScore(0);
        return prev; //gameover
      }

      let copy = JSON.parse(JSON.stringify(prev));
      copy[correspondingCardIndex].clicked = true;

      setScore((score) => {
        setBest((best) => {
          if (score + 1 > best) return score + 1;
          return best;
        });
        return score + 1;
      });

      return copy;
    });

    shuffleUntilOneUnclicked();
  }

  return (
    <div className="App">
      <Scoreboard score={score} best={best} />
      <div className="Game">
        {currentCards.map((card) => {
          return (
            <Card
              img={card.src}
              onClick={(e) => {
                onCardClick(e, card.id);
              }}
            />
          );
        })}
      </div>
      <button className="Button--reset">Clear Highscore</button>
    </div>
  );
}

export default App;
