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
  const N_OF_CARDS_SHOWN = 3;
  let [score, setScore] = useState(0);
  let [best, setBest] = useState(0);
  let [hasWon, setHasWon] = useState(false);

  // eslint-disable-next-line no-unused-vars
  let [cardImages, setCardImages] = useState(Array(N_OF_CARDS).fill({}));
  let [currentCards, setCurrentCards] = useState(
    Array(N_OF_CARDS_SHOWN).fill({})
  );
  let [loading, setLoading] = useState(true);

  async function cacheImages(arr) {
    let promises = [];
    arr.forEach((el) => {
      let newPromise = new Promise((resolve, reject) => {
        let img = new Image();
        img.src = el.src;
        img.onload = resolve(true);
        img.onerror = reject('error loading image');
      });
      promises.push(newPromise);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      throw new Error(error);
    }

    setLoading(false);
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
      cacheImages(arrayOfCardObjects);
      setCardImages(arrayOfCardObjects);
      shuffleUntilOneUnclicked();
    });
  }, []);

  useEffect(() => {
    let savedHighscore = localStorage.highscore;
    if (savedHighscore) {
      setBest(savedHighscore);
    }
  }, []);

  useEffect(() => {
    localStorage.highscore = best;
  }, [best]);

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

  function resetClickStatus() {
    setCardImages((prev) => {
      return prev.map((el) => {
        let copy = el;
        copy.clicked = false;

        return copy;
      });
    });
  }

  function updateScore() {
    setScore((score) => {
      setBest((best) => {
        if (score + 1 > best) return score + 1;
        return best;
      });
      if (score + 1 === N_OF_CARDS) setHasWon(true);
      return score + 1;
    });
  }

  function clearScore() {
    setScore(0);
    setBest(0);
  }

  function gameOver() {
    setScore(0);
    resetClickStatus();
  }

  function onCardClick(e, id) {
    setCardImages((prev) => {
      let correspondingCardIndex = prev.findIndex((el) => el.id === id);

      if (prev[correspondingCardIndex].clicked) {
        gameOver();
        return prev;
      }

      updateScore();

      let copy = JSON.parse(JSON.stringify(prev));
      copy[correspondingCardIndex].clicked = true;

      return copy;
    });

    shuffleUntilOneUnclicked();
  }

  function displayCards() {
    return (
      <React.Fragment>
        {currentCards.map((card) => {
          return (
            <Card
              key={card.id}
              img={card.src}
              onClick={
                !hasWon
                  ? (e) => {
                      onCardClick(e, card.id);
                    }
                  : null
              }
            />
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <Scoreboard score={score} best={best} hasWon={hasWon} />
      <div className="Game">
        {loading ? <span className="loading">Loading...</span> : displayCards()}
      </div>
      <div>
        <button className="Button--reset" onClick={clearScore}>
          Clear score
        </button>
        <button className="Button--reset">Restart</button>
      </div>
    </div>
  );
}

export default App;
