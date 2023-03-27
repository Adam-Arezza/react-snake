import React, { useEffect, useState } from "react";
import GridCell from "./GridCell";
import './Main.css'
const Main = (props) => {
    const [snake, setSnake] = useState([])
    const [grid, setGrid] = useState([])
    const [goal, setGoal] = useState(null)
    const [outOfBounds, setOutOfBounds] = useState(false)
    const [oldGoal, setOldGoal] = useState(null)
    const [cellsToAdd, setCellsToAdd] = useState(0)
    const [selfCollision, setSelfCollision] = useState(false)
    const [score, setScore] = useState(0)
    const { direction, resetDir, speed, needsRestart } = props

    // generates the starting 60 x 60 cell grid
    const generateGrid = () => {
        let gridCells = []
        let snakeXY = [Math.floor(Math.random() * 60), Math.floor(Math.random() * 60)]
        let snakeCells = []
        let goalXY = [Math.floor(Math.random() * 60), Math.floor(Math.random() * 60)]

        for (let i = 0; i < 60; i++) {
            for (let j = 0; j < 60; j++) {
                let currentIdx = 0

                if (i === 0 && j > 0) {
                    currentIdx = j
                }

                if (i > 0) {
                    currentIdx = i * 60 + j
                }

                if (goalXY[1] === i && goalXY[0] === j) {
                    gridCells.push(<GridCell key={currentIdx} x={j} y={i} goalCell={true}></GridCell>)
                    setGoal(<GridCell key={currentIdx} x={j} y={i} goalCell={true}></GridCell>)
                }
                else if (snakeXY[1] === i && snakeXY[0] === j) {
                    gridCells.push(<GridCell key={currentIdx} x={j} y={i} snakeCell={true}></GridCell>)
                    snakeCells.push(<GridCell key={currentIdx} x={j} y={i} snakeCell={true}></GridCell>)
                }
                else {
                    gridCells.push(<GridCell key={currentIdx} x={j} y={i}></GridCell>)
                }
            }
        }

        setGrid(gridCells)
        setSnake(snakeCells)
    }

    //resets the out of bounds bool
    //resets the current direction
    //generates a new grid
    const resetGrid = () => {
        needsRestart(false)
        setOutOfBounds(false)
        generateGrid()
        setCellsToAdd(0)
        setSelfCollision(false)
        setScore(0)
        resetDir()
    }

    //check if the snake head hits the edge of the grid
    const checkEdgeConflict = (x, y) => {
        if (x > 59 || x < 0) {
            setOutOfBounds(true)
            return alert("Out of bounds!")
        }

        if (y > 59 || y < 0) {
            setOutOfBounds(true)
            return alert("Out of bounds!")
        }
    }

    //check if the snake head hits the snake body
    const checkSnakeConflict = (x, y) => {
        const currentSnake = snake
        let snakeBody = currentSnake.slice(1, currentSnake.length)
        let conflict = snakeBody.some(cell => cell.props.x === x && cell.props.y === y)
        if (conflict) {
            setSelfCollision(true)
            return alert("Crashed into snake!")
        }
        else {
            return
        }
    }

    //check if the snake head has reached the goal
    const checkGoalReached = (x, y, goalX, goalY) => {
        if (x === goalX && y === goalY) {
            setCellsToAdd(4)
            setScore(snake.length * 10)
            return true
        }
        else {
            return false
        }
    }

    //sets a new goal cell
    const setNewGoal = () => {
        const currentGrid = grid
        const oldGoal = goal
        const filteredGrid = currentGrid.filter(cell=> !cell.props.snakeCell)
        let goalXY = [Math.floor(Math.random() * filteredGrid.length / 60), Math.floor(Math.random() * filteredGrid.length / 60)]
        let cellToReplace = currentGrid.findIndex(cell => cell.props.x === goalXY[1] && cell.props.y === goalXY[0])
        let newGoal = <GridCell key={cellToReplace} x={goalXY[1]} y={goalXY[0]} goalCell={true}></GridCell>
        currentGrid.splice(cellToReplace, 1, newGoal)
        setGrid(currentGrid)
        setGoal(newGoal)
        setOldGoal(oldGoal)
    }

    //moves the snake in the grid
    const moveSnake = (x, y) => {
        const currentGrid = grid
        const currentSnake = snake
        let newSnakeHead = <GridCell key={y * 60 + x}
            x={x}
            y={y}
            snakeCell={true}
            goalCell={false}></GridCell>

        let newSnake = [newSnakeHead, ...currentSnake]
        if (cellsToAdd > 0) {
            // check if any of the snake is still on the old goal position
            // once the last cell of the snake is on the goal position, create a new snake cell on that position
            let snakeOnOldGoal = newSnake[newSnake.length - 1].props.x === oldGoal.props.x &&
                newSnake[newSnake.length - 1].props.y === oldGoal.props.y
            if (snakeOnOldGoal) {
                let snakeTail = <GridCell key={oldGoal.props.y * 60 + oldGoal.props.x}
                    x={oldGoal.props.x}
                    y={oldGoal.props.y}
                    snakeCell={true}
                    goalCell={false}></GridCell>
                newSnake.push(snakeTail)
            }
            setCellsToAdd(cellsToAdd - 1)
        }
        if (cellsToAdd < 1) {
            newSnake.pop()
        }
        for (let i = 0; i < newSnake.length; i++) {
            currentGrid.splice(newSnake[i].key, 1, newSnake[i])
        }
        let normalCell = <GridCell key={currentSnake[currentSnake.length - 1].key}
            x={currentSnake[currentSnake.length - 1].props.x}
            y={currentSnake[currentSnake.length - 1].props.y}
            snakeCell={false}
            goalCell={false}></GridCell>
        currentGrid.splice(snake[snake.length - 1].key, 1, normalCell)
        setGrid(currentGrid)
        setSnake(newSnake)
    }

    //main loop function for computing the new grid
    const computeCells = () => {
        const currentSnake = snake
        const currentGoal = goal
        const snakeHead = currentSnake[0]
        let newY = snakeHead.props.y
        let newX = snakeHead.props.x

        switch (direction) {
            case "l":
                newX = snakeHead.props.x - 1
                break
            case "r":
                newX = snakeHead.props.x + 1
                break
            case "u":
                newY = (snakeHead.props.y - 1)
                break
            case "d":
                newY = (snakeHead.props.y + 1)
                break
            default:
                break
        }

        checkEdgeConflict(newX, newY)
        checkSnakeConflict(newX, newY)
        let goalReached = checkGoalReached(newX, newY, currentGoal.props.x, currentGoal.props.y)

        if (goalReached) {
            setNewGoal()
        }
        if (direction) {
            moveSnake(newX, newY)
        }
    }

    // generates the main grid once on first render
    useEffect(() => {
        if (grid.length <= 0) {
            generateGrid()
        }
        else {
            return
        }
    }, [grid])

    useEffect(() => {
        if (outOfBounds || selfCollision) {
            needsRestart(true)
        }
    }, [outOfBounds, selfCollision, needsRestart])

    // calls the computeCells function at an interval
    useEffect(() => {
        if (!snake.length || !grid.length) {
            return
        }
        const snakeInterval = setInterval(() => {
            computeCells()
        }, speed)

        if (outOfBounds || selfCollision) {
            clearInterval(snakeInterval)
        }
        return () => clearInterval(snakeInterval)
    })

    return outOfBounds || selfCollision ? <button onClick={() => resetGrid()} className="restart-btn">Restart</button> :
        <div className="game-container">
            <div className="scoreboard">Score: {score}</div>
            <div className="main" >{grid.length > 0 ? grid : null}</div>
        </div>

}

export default Main