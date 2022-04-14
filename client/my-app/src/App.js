import {useEffect, useState} from "react";
import io from 'socket.io-client'
import GameScreen from "./GameScreen";
import Timer from "./Timer";
const socket = io.connect("http://localhost:3001");

const App = () => {



  return (
    <div className="App">

      <p>send link to your opponent, click to copy the link</p>
      <GameScreen></GameScreen>
      <Timer></Timer>
    </div>
  );
};

export default App;
