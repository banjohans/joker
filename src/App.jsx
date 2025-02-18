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

const generatePrizeList = () => {
  let baseAmount = Math.floor(Math.random() * (500000 - 350000 + 1)) + 350000;
  let prizes = Array.from({ length: 6 }, () => {
    baseAmount += Math.floor(Math.random() * (800000 - 300000 + 1)) + 300000;
    return baseAmount;
  });
  return prizes; // Beholder rekkefølgen slik at laveste premie er først
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
  const [prizeList, setPrizeList] = useState(generatePrizeList());
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);

  const handleGuess = (index, position) => {
    if (revealed[index].over || revealed[index].under) return;

    const hiddenValue = hiddenNumbers[index][position];
    const referenceValue = numbers[index];
    let isCorrect = false;

    if (
      (position === "over" && hiddenValue >= referenceValue) ||
      (position === "under" && hiddenValue <= referenceValue)
    ) {
      isCorrect = true;
    }

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

    if (isCorrect && currentPrizeIndex < prizeList.length - 1) {
      setCurrentPrizeIndex((prev) => prev + 1);
    } else if (!isCorrect && currentPrizeIndex > 0) {
      setCurrentPrizeIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="game-container">
      <div className="game-wrapper">
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
        <div className="game-score">
          Gjeldende pengesum: {prizeList[currentPrizeIndex].toLocaleString()} kr
        </div>
        <br />
        <div className="prize-list">
          {prizeList
            .slice()
            .reverse()
            .map((prize, index) => (
              <div
                key={index}
                className={`prize-box ${
                  prizeList.length - 1 - index === currentPrizeIndex
                    ? "active-prize"
                    : ""
                }`}
              >
                {prize.toLocaleString()} kr
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
