import React, { useContext, useRef } from "react";
import { Paper } from "@mui/material";
import CardContext from "../../contexts/CardContext";
import './Gallery.css';

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

const Gallery = () => {
    const key = useRef(0);
    const { activeCards: cards, winPlayer: winner } = useContext(CardContext);

    return (
        <div className="gallery">
            <div className={"card-container" + (winner === 1 ? " winner" : "")}>
                {cards?.playerOne.map((card) => (
                    <GalleryItem key={key.current++} value={card} />
                ))}
            </div>
            <div className={"card-container" + (winner === 2 ? " winner" : "")}>
                {cards?.playerTwo.map((card) => (
                    <GalleryItem key={key.current++} value={card} />
                ))}
            </div>
        </div>
    );
}

const GalleryItem = ({ value }) => {
    return (
        <Paper className="card" variant="elevation" elevation={4} >
            <img src={getCardImage(value)} />
        </Paper>
    );
}

export default Gallery;