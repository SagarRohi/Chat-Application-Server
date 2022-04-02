require('dotenv').config()
const express=require('express');
const http=require('http');
const socketIo=require('socket.io');
const {addUser,removeUser,usersInRoom} =require('./user');
const app=express();
const PORT=process.env.PORT || 8000;
const server=http.createServer(app);
server.listen(PORT,()=>{
    console.log("Chat Server is Running At Port",PORT);
})
const io=socketIo(server,{
    cors:{
        origin:'*',
    }
});

app.get('/',(req,res)=>{
    console.log("HI");
    return res.status(200).json({
        message:"SuccessFully Arrived At destination",
    })
})
io.on('connection',(socket)=>{
     socket.on('join',({name,room},callback)=>{
         const data=addUser(socket.id,name,room);
         if(!data.success){
           return callback(data.message);
         }
         socket.join(room);
         socket.emit('message',{user:'admin',text:`${name} welcome to Domino` });
         socket.broadcast.to(room).emit('message',{user:'admin',text:`${name} has joined Domino`});
         io.to(room).emit('roomData',usersInRoom(room).users);
     })
     
     socket.on('sendMessage',({message,name,room})=>{
         io.to(room).emit('message',{user:name,text:message})
     })
     socket.on('back',()=>{
        const {success,user}=removeUser(socket.id);
        if(success){
            socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has left Domino`});
            io.to(user.room).emit('roomData',usersInRoom(user.room).users);
        }
     })
     socket.on('disconnect',()=>{
         const {success,user}=removeUser(socket.id);
         if(success){
             socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has left Domino`});
             io.to(user.room).emit('roomData',usersInRoom(user.room).users);
         }
     })
})
