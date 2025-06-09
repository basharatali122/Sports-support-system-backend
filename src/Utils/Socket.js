const socket = require("socket.io")


const initialaizedSocketio = (server)=>{


   const io = socket(server,{
    cors:{
        origin:"http://localhost:5173"
    }
   })

   io.on("connection",(socket)=>{
    socket.on("joinChat",()=>{})
    socket.on("sendMessage",()=>{})
    socket.on("disconnnect",()=>{})
   })

}


module.exports=initialaizedSocketio;