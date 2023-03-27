import React from "react";

const GridCell = (props) => {
    
return <div className={`grid-cell 
            ${props.goalCell? 'goal-cell':null} 
            ${props.snakeCell? 'snake-cell': null}`}>{props.temp}</div>
}

export default GridCell