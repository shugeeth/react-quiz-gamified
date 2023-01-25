import "./App.css";
import styled from "styled-components";
import { useState, useEffect } from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const FLOOR_BUFFER_HEIGHT = 1;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;
const OBSTACLE_SPEED = 5;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  // Handle Bird Drop
  useEffect(() => {
    let birdFallLoop;
    if (
      gameStarted &&
      birdPosition < GAME_HEIGHT - BIRD_SIZE - FLOOR_BUFFER_HEIGHT
    ) {
      birdFallLoop = setInterval(() => {
        // console.log("SetInterval function called. "+ birdPosition)
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24); // Should run for 24 frames
    } else {
      setBirdPosition(GAME_HEIGHT - BIRD_SIZE - FLOOR_BUFFER_HEIGHT);
    }

    return () => {
      // console.log("ClearInterval function called. "+ birdPosition)
      clearInterval(birdFallLoop);
    };
  }, [gameStarted, birdPosition]);

  // Handle Obstacle movement
  useEffect(() => {
    let obstacleLeftLoop;
    if (gameStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleLeftLoop = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - OBSTACLE_SPEED);
      }, 24); // Should run for 24 frames

      // Return cleanup function
      return () => {
        clearInterval(obstacleLeftLoop);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      // Set a random height from GAME_HEIGHT excluding OBSTACLE_GAP
      setObstacleHeight(Math.floor(Math.random * (GAME_HEIGHT - OBSTACLE_GAP)));
      setScore((score)=>score+1)
    }
    // Return cleanup function
    return () => {
      clearInterval(obstacleLeftLoop);
    };
  }, [gameStarted, obstacleLeft]);

  // Handle collisions
  useEffect(() => {
    
  }, []);

  const handleMainDivClick = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <Div onClick={handleMainDivClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          height={obstacleHeight}
          width={OBSTACLE_WIDTH}
          left={obstacleLeft}
        />
        <Obstacle
          top={OBSTACLE_GAP}
          height={GAME_HEIGHT - (obstacleHeight + OBSTACLE_GAP)}
          width={OBSTACLE_WIDTH}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span>{score}</span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span{
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  background-color: green;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`;
