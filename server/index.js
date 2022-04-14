const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require("cors");
const { isPromise } = require('util/types');
const { compileFunction } = require('vm');

app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});




let global_room = [
    {roomId: "testroom1",
    last_move_list: [{"testconnection1": 0},{"testconnection2": 0}],
    game_state: "not ready"
    }
];


io.on("connection",(socket)=>{
    console.log(`user connected: ${socket.id}`);
    
    socket.on("join_room", (data)=>{
        socket.join(data.roomId);
        io.to(data.id).emit("receive_message",`joined room ${data.roomId}`)
        console.log(data.id+" joined room "+data.roomId)
        
        //if the room1 doesn't exist in global_room 
        //The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise -1 is returned.
        let room_index = global_room.findIndex(x=>x.roomId === data.roomId);
        if(room_index === -1){
            global_room.push(
                {
                    roomId: data.roomId, 
                    last_move_list: [{[data.id]: 0}], 
                    game_state: "not ready"
                }
            );
            //redefine room_index so that it is no longer -1
            room_index = global_room.findIndex(x=>x.roomId === data.roomId);
        //if room1 alreayd exists then need to find if the particular client has already joined    
        //this global_room[room_index].last_move_list.findIndex(x=>x.id === data.id) is not working
        //idk why
        } else if(global_room[room_index].last_move_list.findIndex(x=>x.id === data.id) === -1){
            console.log(global_room[room_index].last_move_list.findIndex(x=>x.id === data.id));
            //if room1 exists in globalroom and this client hasn't joined already 
            global_room[room_index].last_move_list.push({[data.id]: 0});
        } //if room1 already exists and client has already joined, no need to do anything


        //check if at least two players have joined the room 
        let number_of_players_in_room = global_room[room_index].last_move_list.length;
        if(number_of_players_in_room >= 2){
            //let clients know game is ready to start
            io.in(data.room).emit("receive_message", "game is ready to start");
            //update game_state
            global_room[room_index].game_state = "ready";
            console.log("room "+data.roomId+" is ready to start")
        }

        console.log(global_room[room_index].last_move_list);

    })

    socket.on("send_message", (data)=>{
        console.log(data.id+" played "+data.player_move);
        io.to(data.id).emit("receive_message", data.player_move);
    });






});






server.listen(3001, ()=>{
    console.log("server is running")
})