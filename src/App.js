import { useEffect, useState } from 'react';
import './App.css';
import Main from './components/Main';
function App() {
  const [direction, setDirection] = useState("")
  const [difficulty, setDifficulty] = useState("normal")
  const [speed, setSpeed] = useState(250)
  const [restart, setNeedsRestart] = useState(false)

  const resetDirection = () => {
    setDirection("")
  }
  //handles direction input
  const changeDirection = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "d") {
          setDirection("u")
        }
        break
      case "ArrowDown":
        if (direction !== "u") {
          setDirection("d")
        }
        break
      case "ArrowLeft":
        if (direction !== "r") {
          setDirection("l")
        }

        break
      case "ArrowRight":
        if (direction !== "l") {
          setDirection("r")
        }

        break
      default:
        break
    }
  }

  const changeDifficulty = (e) => {
    setDifficulty(e.target.value.toLowerCase())
  }

  const difficultyOptions = () => {
    let options = ["easy", "normal", "hard", "crazy"]
    let optionsList = options.map((option, i) => {
      return <option key={i}>{option.toUpperCase()}</option>
    })
    return optionsList
  }

  const needsRestart = (restart) => {
    setNeedsRestart(restart)
  }

  useEffect(() => {
    if (difficulty === "easy") {
      setSpeed(300)
    }
    if (difficulty === "normal") {
      setSpeed(200)
    }
    if (difficulty === "hard") {
      setSpeed(100)
    }
    if (difficulty === "crazy") {
      setSpeed(50)
    }
  }, [difficulty])

  return (
    <div className="App" tabIndex={-1} onKeyDown={changeDirection}>
      {restart ? null : <div className='settings-bar'>
        <select className='select-difficulty' onChange={(e) => changeDifficulty(e)}>
          {difficultyOptions()}
        </select>
      </div>}
      <Main
        resetDir={resetDirection}
        direction={direction}
        speed={speed}
        needsRestart={needsRestart}></Main>
    </div>
  );
}

export default App;
