import React, { useState, useEffect, useRef } from "react";
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
  let baseAmount = Math.floor(Math.random() * 200000);
  let prizes = Array.from({ length: 6 }, () => {
    baseAmount += Math.floor(Math.random() * (800000 - 300000 + 1)) + 300000;
    return baseAmount;
  });
  return prizes;
};

export default function NumberGame() {
  const [isPlaying, setIsPlaying] = useState(false);

  const resetGame = () => {
    setNumbers(generateNumbers());
    setHiddenNumbers(generateHiddenNumbers(numbers));
    setRevealed(Array(5).fill({ over: false, under: false }));
    setGuessResults(Array(5).fill({ over: null, under: null }));
    setPrizeList(generatePrizeList());
    setCurrentPrizeIndex(0);
    setSurpriseBox({
      index: Math.floor(Math.random() * 5),
      position: Math.random() < 0.5 ? "over" : "under",
    });
    setGameOver(false);
  };

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
  const [surpriseBox, setSurpriseBox] = useState({
    index: Math.floor(Math.random() * 5),
    position: Math.random() < 0.5 ? "over" : "under",
  });
  const [gameOver, setGameOver] = useState(false);
  const prizeListRef = useRef(null);

  useEffect(() => {
    if (prizeListRef.current) {
      const activePrize = prizeListRef.current.querySelector(".active-prize");
      if (activePrize) {
        activePrize.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentPrizeIndex]);

  const handleGuess = (index, position) => {
    if (gameOver || revealed[index].over || revealed[index].under) return;

    if (index === surpriseBox.index && position === surpriseBox.position) {
      setCurrentPrizeIndex(prizeList.length - 1);
      setGameOver(true); // Disable all further interactions
      setRevealed((prev) => {
        const newRevealed = [...prev];
        newRevealed[index] = { ...prev[index], [position]: "surprise" }; // Set surprise state
        return newRevealed;
      });
      return;
    }

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
    <>
      <button
        className="sound-button"
        onClick={() => {
          const audio = document.getElementById("background-audio");
          if (audio) {
            audio.play();
            setIsPlaying(true); // Hide button after playing
          }
        }}
        style={{ display: isPlaying ? "none" : "block" }} // Hide when playing
      >
        🔊 Turn on Sound
      </button>
      <audio id="background-audio" loop>
        <source src="/public/jokervignet.mp3" type="audio/mpeg" />
      </audio>
      <div className="game-container">
        <div className="game-wrapper">
          <button className="reset-button" onClick={resetGame}>
            Reset Game
          </button>
          <h1 className="game-title">
            <img src="./jester.png" width={125} height={70} alt="Jester" />
            <br />
            Joker
          </h1>
          <div className="game-grid">
            {numbers.map((num, index) => (
              <div key={index} className="game-column">
                <div
                  className={`game-box ${
                    index === surpriseBox.index &&
                    "over" === surpriseBox.position &&
                    revealed[index].over === "surprise"
                      ? "surprise-box"
                      : guessResults[index].over
                      ? guessResults[index].over
                      : ""
                  } ${revealed[index].under ? "inactive" : ""}`}
                  onClick={
                    !gameOver && !revealed[index].under
                      ? () => handleGuess(index, "over")
                      : undefined
                  }
                >
                  {revealed[index].over !== "surprise" && revealed[index].over
                    ? hiddenNumbers[index].over
                    : ""}
                </div>
                <div className="game-number">{num}</div>
                <div
                  className={`game-box ${
                    index === surpriseBox.index &&
                    "under" === surpriseBox.position &&
                    revealed[index].under === "surprise"
                      ? "surprise-box"
                      : guessResults[index].under
                      ? guessResults[index].under
                      : ""
                  } ${revealed[index].over ? "inactive" : ""}`}
                  onClick={
                    !gameOver && !revealed[index].over
                      ? () => handleGuess(index, "under")
                      : undefined
                  }
                >
                  {revealed[index].under !== "surprise" && revealed[index].under
                    ? hiddenNumbers[index].under
                    : ""}
                </div>
              </div>
            ))}
          </div>
          <div className="game-score">
            Premie: {prizeList[currentPrizeIndex].toLocaleString()} kr
          </div>
          <br />
          <div className="prize-list" ref={prizeListRef}>
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
    </>
  );
}
