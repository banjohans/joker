import React, { useState } from "react";
import "./NumberGame.css";

const generateNumbers = () => {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1);
};

const generateHiddenNumbers = (numbers) => {
  return numbers.map(() => {
    const hiddenValue = Math.floor(Math.random() * 9) + 1;
    return { over: hiddenValue, under: hiddenValue };
  });
};

export default function NumberGame() {
  const [numbers, setNumbers] = useState(generateNumbers());
  const [hiddenNumbers, setHiddenNumbers] = useState(
    generateHiddenNumbers(numbers)
  );
  const [revealed, setRevealed] = useState(
    Array(5).fill({ over: false, under: false })
  );
  const [guessResults, setGuessResults] = useState(
    Array(5).fill({ over: null, under: null })
  );
  const [score, setScore] = useState(0);

  const handleGuess = (index, position) => {
    if (revealed[index].over || revealed[index].under) return;

    const hiddenValue = hiddenNumbers[index][position];
    const referenceValue = numbers[index];
    let newScore = score;
    let isCorrect = false;

    if (
      (position === "over" && hiddenValue >= referenceValue) ||
      (position === "under" && hiddenValue <= referenceValue)
    ) {
      newScore += 1;
      isCorrect = true;
    }

    setScore(newScore);
    setRevealed((prev) => {
      const newRevealed = [...prev];
      newRevealed[index] = {
        over: position === "over",
        under: position === "under",
      };
      return newRevealed;
    });
    setGuessResults((prev) => {
      const newGuessResults = [...prev];
      newGuessResults[index] = {
        ...newGuessResults[index],
        [position]: isCorrect ? "correct" : "wrong",
      };
      return newGuessResults;
    });
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Joker</h1>
      <div className="game-grid">
        {numbers.map((num, index) => (
          <div key={index} className="game-column">
            <div
              className={`game-box ${
                guessResults[index].over ? guessResults[index].over : ""
              } ${revealed[index].under ? "inactive" : ""}`}
              onClick={
                !revealed[index].under
                  ? () => handleGuess(index, "over")
                  : undefined
              }
            >
              {revealed[index].over ? hiddenNumbers[index].over : ""}
            </div>
            <div className="game-number">{num}</div>
            <div
              className={`game-box ${
                guessResults[index].under ? guessResults[index].under : ""
              } ${revealed[index].over ? "inactive" : ""}`}
              onClick={
                !revealed[index].over
                  ? () => handleGuess(index, "under")
                  : undefined
              }
            >
              {revealed[index].under ? hiddenNumbers[index].under : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="game-score">Score: {score}</div>
    </div>
  );
}
