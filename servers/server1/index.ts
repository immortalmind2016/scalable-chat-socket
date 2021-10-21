
import {createClient} from "redis"


const publisher = createClient({
    url:"redis://localhost:6379"
});
const subscriber = createClient({
    url:"redis://localhost:6379"
});
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors:{
      origin:"*"
  }
});
const rooms={
    room1:["user20","user21"]
}

io.on("connection", (socket: Socket) => {
console.log("connection")
socket.on("join",({room,user})=>{
  try{
    console.log("JOIN")
    rooms[room].push(user)
    console.log({rooms})
    socket.join(room)

    io.to(room).emit("join",user)
    publisher.publish("join-from-1", JSON.stringify({room,user}));
  }catch(e){
      console.log(e)
  }
})
});
const channels=["join-from-2"]

subscriber.on('message',(channel,message)=>{
    console.log({message,channel})
    if(channels.includes(channel))
   {
    const {room,user}=JSON.parse(message)
    console.log("SUBSCRIP ",room,user)
    io.to(room).emit("join",user)
   }
})

httpServer.listen(3000)
subscriber.subscribe(channels)



