const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require("cors");
const { isPromise } = require('util/types');
const { compileFunction } = require('vm');
const {GAME_NOT_READY, GAME_READY, GAME_START, GAME_END} = require('./message_meaning');



app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});




let global_room = [
    {
        roomId: "testroom1",
        last_move_list: [{"testconnection1": 0},{"testconnection2": 0}],
        game_state: GAME_NOT_READY
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
                    game_state: GAME_NOT_READY
                }
            );
            //redefine room_index so that it is no longer -1
            room_index = global_room.findIndex(x=>x.roomId === data.roomId);
        //if room1 alreayd exists then need to find if the particular client has already joined    
        //this global_room[room_index].last_move_list.findIndex(x=>x.id === data.id) is not working
        //idk why
        } else if(global_room[room_index].last_move_list.findIndex(x=>data.id in x) === -1){
            //if room1 exists in globalroom and this client hasn't joined already 
            global_room[room_index].last_move_list.push({[data.id]: 0});
        } //if room1 already exists and client has already joined, no need to do anything


        //check if at least two players have joined the room 
        let number_of_players_in_room = global_room[room_index].last_move_list.length;
        if(number_of_players_in_room >= 2){
            //let clients know game is ready to start
            io.in(data.room).emit("receive_message", GAME_READY);
            //update game_state
            global_room[room_index].game_state = GAME_READY;
            console.log("room "+data.roomId+" is ready to start")

            console.log("game has started");
            global_room[room_index].game_state = GAME_START;
            io.in(data.room).emit("receive_message", GAME_START);

            //wait 10 seconds then
            setTimeout(function(){
                //update game state to GAME_END
                global_room[room_index].game_state = GAME_END;
                //tell clients game is done 
                io.in(data.room).emit("receive_message", GAME_END);
                
                //tell each client their respective opponent's move
                if (global_room[room_index].last_move_list.findIndex(x=> data.id in x) === 0){
                    io.to(data.id).emit("receive_message", global_room[room_index].last_move_list[1].) 
                    
                }
                
            }, 10000);
        }

    })

    socket.on("send_message", (data)=>{
        console.log(data.id+" played "+data.player_move);
        io.to(data.id).emit("receive_message", data.player_move);
        //if game state is GAME_START then update player moves if not player move won't be updated
        let current_global_room = global_room.find(x=>x.roomId); 
        if (current_global_room.game_state === GAME_START){
            current_global_room.game_state = data.player_move;
        }


    });



});




server.listen(3001, ()=>{
    console.log("server is running")
})