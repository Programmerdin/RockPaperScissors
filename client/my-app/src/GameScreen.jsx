import rockicon from "./images/rock-icon.png";
import papericon from "./images/paper-icon.png";
import scissorsicon from "./images/scissors-icon.png";
import questionmarkicon from "./images/question-mark.jpg";

import { useEffect, useState } from "react";
import "./GameScreen.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");



const GameScreen = () => {
  let socketId = socket.id;

    //room state
    const [room_number, setRoomNumber] = useState("");
    //join room
    const joinroom = () => {
      if (room_number !== ""){
        socket.emit("join_room", {roomId: room_number, id: socket.id})
      }
    }


  //send player move message to server
  const sendMessage = (move_command) => {
    socket.emit("send_message", {roomId: room_number, id: socket.id, player_move: move_command})
  };

  //message states
  const [messageReceived, setMessageReceived] = useState("");
  //listen for messages from server and figure out which function needs to be run
  useEffect(()=>{
    socket.on("receive_message", (data)=>{
      console.log("received_message" , data);
      setMessageReceived(data);
    })
  }, [socket])


  //is opponent online? true=theyre in the room, false=theyre not in the room
  const [opponent_status, setOpponentStatus] = useState(false);
  const SetOpponentStatusToTrue = () => {setOpponentStatus(true)};
  const SetOpponentStatusToFalse = () => {setOpponentStatus(false)};

  //your move and send message to server
  const [move, setMove] = useState(0);
  const handleSetMoveRock = () => {setMove(1); sendMessage(1);};
  const handleSetMovePaper = () => {setMove(2); sendMessage(2);};
  const handleSetMoveScissors = () => {setMove(3); sendMessage(3);};
  const handleSetMoveReset = () => {setMove(0); sendMessage(0);};

  //opponent move
  const [opponent_move, setOpponentMove] = useState(0);
  const handleSetOpponentMoveRock = () => {setOpponentMove(1)};
  const handleSetOpponentMovePaper = () => {setOpponentMove(2)};
  const handleSetOpponentMoveScissors = () => {setOpponentMove(3)};
  const handleSetOpponentMoveReset = () => {setOpponentMove(0)};

  




  return (
    <div className="GameScreen">
      <input placeholder="Room number" onChange={(event)=>{
        setRoomNumber(event.target.value)
      }}></input>
      <button onClick={joinroom}>Join</button>


      <div className="GameScreen-1">
        <div className="GameScreen-1-1a">
          <h1>Opponent</h1>
        </div>
        <div className="GameScreen-1-1b">

        </div>
        <div className="GameScreen-1-1c">
          <h1>You</h1>
        </div>
        <div className="GameScreen-1-2a">
          <div>
            <img className="move-display" src={questionmarkicon}></img>
          </div>
        </div>
        <div className="GameScreen-1-2b">
          <div>vs</div>
        </div>
        <div className="GameScreen-1-2c">
          <div>
            <img className="move-display" src={move===0?questionmarkicon:move===1?rockicon:move===2?papericon:move===3?scissorsicon:questionmarkicon}></img>
          </div>
        </div>

      </div>
      <div className="GameScreen-2">
        <div className="GameScreen-2-1a">
          Pick your move:
        </div>
        <div className="GameScreen-2-2a">
          <img className="move-icon" src={rockicon} onClick={handleSetMoveRock}></img>
          <img className="move-icon" src={papericon} onClick={handleSetMovePaper}></img>
          <img className="move-icon" src={scissorsicon} onClick={handleSetMoveScissors}></img>
        </div>
      </div>
      <p>current state: {move}</p>
      <p>room id: {room_number}</p>
      <p>last message from server: {messageReceived}</p>
      <p>my connection id: {socketId}</p>

    </div>
  );
};

export default GameScreen;
