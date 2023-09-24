import React, { useContext } from 'react';
import CardContext from '../../contexts/CardContext';
import './Scoreboard.css';

const Scoreboard = () => {
    const { score } = useContext(CardContext);

    return (
        <div className="scoreboard">
            <PlayerScore number={1} score={score.playerOne} leading={score.playerOne > score.playerTwo} />
            <PlayerScore number={2} score={score.playerTwo} leading={score.playerOne < score.playerTwo} />
        </div>
    );
}

const PlayerScore = ({ number, score, leading }) => {
    return (
        <div className="score">
            <h4>Player {number}</h4>
        <h1 className={"score-value" + (leading ? " leading" : "")}>{score}</h1>
        </div>
    );
}

export default Scoreboard;