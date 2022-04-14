import {useEffect, useState} from "react";
import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")

const Timer = () => {


  return (
    <div className="Timer">
        Timer
    </div>
  );
}

export default Timer;