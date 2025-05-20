import { useState, useEffect, useRef } from "react";
import Dice from "./components/Dice"
import { nanoid, random } from "nanoid";
import Confetti from 'react-confetti'

import Die1 from "./assets/die1.svg"
import Die2 from "./assets/die2.svg"
import Die3 from "./assets/die3.svg"
import Die4 from "./assets/die4.svg"
import Die5 from "./assets/die5.svg"
import Die6 from "./assets/die6.svg"

function App() {
  const diceSvg =[Die1,Die2,Die3,Die4,Die5,Die6];

  const[dice,setDice] = useState(() => generateAllDiceArr())
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // This checks if the window is resized so the confetti arent bugged
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const gameWon=dice.every(die=> die.isHeld) && dice.every(die=> die.randNumb===dice[0].randNumb);
  const buttonRef  = useRef(null)
  
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon])
  
  function getRandomNumber() {
    const min = Math.ceil(1);
    const max = Math.floor(6);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateAllDiceArr() {
    return new Array(10).fill(0)
    .map(() => {
      const numb = getRandomNumber();
      return {
        randNumb:numb,
        isHeld: false,
        id: nanoid(),
        svg: diceSvg[numb - 1],
      };
    });
  }

  const diceElements = dice.map(dieObject =>
    <Dice 
    svg={dieObject.svg}
    hold={hold}
    id={dieObject.id}
    key={dieObject.id}
    value={dieObject.randNumb}
    clicked={dieObject.isHeld} />
  );
  

  function rollDice() {
    setDice(oldDice => {
      return oldDice.map(oldDie =>
        oldDie.isHeld ? oldDie : {...oldDie, randNumb: getRandomNumber()}
      )
      .map(olddie => olddie.isHeld ? olddie :{...olddie, svg: diceSvg[olddie.randNumb-1]})
    });
  }

  function newGame() {
    setDice(generateAllDiceArr)
  }

  function hold(id)
  {
    setDice(oldDiceObjects => 
      (
        oldDiceObjects.map(oldDieObject => 
          oldDieObject.id === id 
          ? {...oldDieObject,isHeld : !oldDieObject.isHeld}
          : oldDieObject
        )
      ));
  }

  return (
    <> 
    {gameWon && <Confetti width={windowSize.width} height={windowSize.height} />}
    <div aria-live="polite" className="sr-only">
      {gameWon&& <p>Congratulations! You won! Press "New Game" to start again.</p>}
    </div>
    <main className="main-wrapper">
      <h1 className="title">Tenzies</h1>
      
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-wrapper">
        {diceElements}
      </div>
      
      <button 
        ref={buttonRef}
        onClick={gameWon ? newGame : rollDice} 
        className="roll-dice-btn"
        aria-label={gameWon? "New game button" : "Rool Again button"}>
          {gameWon ? "New Game" : "Roll Dice"}
      </button>
    </main>
    </>
  )
}

export default App
