let User=[];

const addUser=(id,name,room)=>{
    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase();
 let user=User.find((user)=>(user.name===name));
 if(user) return {
     success:false,
     message:"username already Exist",
 }
 User.push({id,name,room});
 return {
     success:true,
     message:"User is added",
 }
}

const removeUser=(id)=>{
    const user=User.find((user)=>user.id===id);
    User=User.filter((user)=>user.id!=id);
    const success=user?true:false;
    return {
        success,user
    }
}

const usersInRoom=(room)=>{
    room=room.trim().toLowerCase();
    const users=User.filter((user)=>user.room==room);
    return {
        success:true,
        users
    }
}

module.exports={addUser,removeUser,usersInRoom};