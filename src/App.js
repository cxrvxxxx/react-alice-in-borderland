import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';

const getRandomNumber = (min, max) => {
  if (min >= 0 && max > min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    return null;
  }
}

const getCardImage = ({ suit, value }) => {
  let path = "/images/cards/";

  switch (value) {
    case 14:
      path += "ace_of_";
      break;
    case 11:
      path += "jack_of_";
      break;
    case 12:
      path += "queen_of_";
      break;
    case 13:
      path += "king_of_";
      break;
    default:
      path += value + "_of_";
  }

  switch (suit) {
    case 1:
      path += "clubs.png";
      break;
    case 2:
      path += "diamonds.png";
      break;
    case 3:
      path += "hearts.png";
      break;
    case 4:
      path += "spades.png";
      break;
    default:
  }

  return path;
}

const dealCards = () => {
  const cards = [];
  const maxSuit = 4;
  const maxValue = 14;

  while (cards.length < 6) {
    const newCard = {
      "suit": getRandomNumber(1, maxSuit),
      "value": getRandomNumber(2, maxValue)
    };

    const cardExists = cards.some((card) => card.suit === newCard.suit && card.value === newCard.value);

    if (!cardExists) {
      cards.push(newCard);
    }
  }

  return cards;
}

const isStraightFlush = (cards) => {
  let prevValue = cards[0].value;
  let prevSuit = cards[0].suit;

  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value - 1 !== prevValue || cards[i].suit !== prevSuit) return false;
    else {
      prevValue = cards[i].value;
      prevSuit = cards[i].suit;
    }
  }

  return true;
}

const isThreeOfAKind = (cards) => {
  let prev = cards[0].value;

  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value !== prev) return false;
  }

  return true;
}

const isStraight = (cards) => {
  let prevValue = cards[0].value;

  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value - 1 !== prevValue) return false;
    else {
      prevValue = cards[i].value;
    }
  }

  return true;
}

const isFlush = (cards) => {
  let prevSuit = cards[0].suit;

  for (let i = 1; i < cards.length; i++) {
    if (cards[i].suit !== prevSuit) return false;
  }

  return true;
}

const isPair = (cards) => {
  for (let x = 0; x < cards.length; x++) {
    for (let i = x + 1; i < cards.length; i++) {
      if (cards[x].value === cards[i].value) return true;
    }
  }

  return false;
}

const getHighestNumber = (cards) => {
  let max = cards[0].value;

  for (let i = 1; i < cards.length; i++) {
    if (cards[i].value > max) max = cards[i].value;
  }

  return max;
}

const getSecondHighestNumber = (cards) => {
  let highest = -Infinity;
  let secondHighest = -Infinity;

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].value > highest) {
      secondHighest = highest;
      highest = cards[i].value;
    } else if (cards[i].value > secondHighest && cards[i].value !== highest) {
      secondHighest = cards[i].value;
    }
  }

  return secondHighest;
}

const getThirdHighestNumber = (cards) => {
  let highest = -Infinity;
  let secondHighest = -Infinity;
  let thirdHighest = -Infinity;

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].value > highest) {
      thirdHighest = secondHighest;
      secondHighest = highest;
      highest = cards[i].value;
    } else if (cards[i].value > secondHighest && cards[i].value !== highest) {
      thirdHighest = secondHighest;
      secondHighest = cards[i].value;
    } else if (cards[i].value > thirdHighest && cards[i].value !== secondHighest && cards[i].value !== highest) {
      thirdHighest = cards[i].value;
    }
  }

  return thirdHighest;
}

const getWinner = (activeCards) => {
  const p1Cards = activeCards.playerOne;
  const p2Cards = activeCards.playerTwo;

  if (p1Cards.length === 0 || p2Cards.length === 0) return null;

  let winner = null;

  const winConditions = [
    isStraightFlush,
    isThreeOfAKind,
    isStraight,
    isFlush,
    isPair
  ]

  const winReasons = [
    "Straight Flush",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Pair",
    "Highest Number",
    "Second Highest Number",
    "Third Highest Number",
  ]

  let i = 0;
  for (i = 0; i < winConditions.length; i++) {
    if (winConditions[i](p1Cards) && !winConditions[i](p2Cards)) {
      winner = 1;
      break;
    } else if (winConditions[i](p2Cards) && !winConditions[i](p1Cards)) {
      winner = 2;
      break;
    }
  }

  if (!winner) {
    if (getHighestNumber(p1Cards) > getHighestNumber(p2Cards)) winner = 1;
    else if (getHighestNumber(p1Cards) < getHighestNumber(p2Cards)) winner = 2;
    else {
      i++;
      if (getSecondHighestNumber(p1Cards) > getSecondHighestNumber(p2Cards)) winner = 1;
      else if (getSecondHighestNumber(p1Cards) < getSecondHighestNumber(p2Cards)) winner = 2;
      else {
        i++;
        if (getThirdHighestNumber(p1Cards) > getThirdHighestNumber(p2Cards)) winner = 1;
        else if (getThirdHighestNumber(p1Cards) < getThirdHighestNumber(p2Cards)) winner = 2;
        else return { "winner": 0, "reason": "Draw" }
      }
    }
  }

  return { "winner": winner, "reason": winReasons[i] }
}

const App = () => {
  const key = useRef(0);
  const [activeCards, setActiveCards] = useState({
    "playerOne": [],
    "playerTwo": []
  });

  const [score, setScore] = useState({
    "playerOne": 0,
    "playerTwo": 0
  })

  const [winPlayer, setWinPlayer] = useState(0);
  const [winReason, setWinReason] = useState("");

  const handleDealCardsClick = (e) => {
    e.preventDefault();
    const cards = dealCards();
    const p1Cards = cards.splice(0, 3);
    const p2Cards = cards;

    const newCards = {
      ...activeCards,
      "playerOne": p1Cards,
      "playerTwo": p2Cards
    }

    setActiveCards(newCards);
  };

  useEffect(() => {
    let winner = getWinner(activeCards);

    switch (winner?.winner) {
      case 1:
        setScore({
          ...score,
          "playerOne": score.playerOne + 1
        });
        break;
      case 2:
        setScore({
          ...score,
          "playerTwo": score.playerTwo + 1
        });
        break;
      default:
    }

    setWinPlayer(winner?.winner);
    setWinReason(winner?.reason);

    winner = null;
  }, [activeCards]);

  return (
    <div className="App">
      <div className="gallery">
        <div className={"card-container" + (winPlayer === 1 ? " winner" : "")}>
          {activeCards?.playerOne.map((value) => (
            <Paper
              key={key.current++}
              className="card"
              variant="elevation"
              elevation={4} >
              <img src={getCardImage(value)} />
            </Paper>
          ))}
        </div>
        <div className={"card-container" + (winPlayer === 2 ? " winner" : "")}>
          {activeCards?.playerTwo.map((value) => (
            <Paper
              key={key.current++}
              className="card"
              variant="elevation"
              elevation={4} >
              <img src={getCardImage(value)} />
            </Paper>
          ))}
        </div>
      </div>
      <div className="win-reason">
        <h1>{winReason}</h1>
      </div>
      <div className="button-container">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleDealCardsClick}
        >Deal Cards</Button>
      </div>
      <div className="scoreboard">
        <div className="score">
          <h4>Player One</h4>
          <h1 className={"score-value" + (score.playerOne > score.playerTwo ? " leading" : "")} >{score.playerOne}</h1>
        </div>
        <div className="score">
          <h4>Player Two</h4>
          <h1 className={"score-value" + (score.playerOne < score.playerTwo ? " leading" : "")}>{score.playerTwo}</h1>
        </div>
      </div>
    </div>
  );
}

export default App;