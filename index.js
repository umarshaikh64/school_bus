const express = require("express");
const socketIo = require("socket.io");
const http = require("http");


const app = express();
const createServer = http.createServer(app);


const users = [
    {
        "id": 1,
        "name": "Umar Shaikh",
        "number": "034235252",
        "GMRegion": "25.4073446,68.3759121",
        "socketId": "",
    },
    {
        "id": 2,
        "name": "Salman Shaikh",
        "number": "034235252",
        "GMRegion": "25.4084609,68.3702199",
        "socketId": "",
    },
    {
        "id": 4,
        "name": "Noman Shaikh",
        "number": "034235252",
        "GMRegion": "25.4086737,68.3678363",
        "socketId": "",
    }
];

const io = new socketIo(createServer);
io.on("connection", (socket) => {
    console.log(socket.id);
   
    socket.on("userLogin", (data) => {
        socket.emit("allUser",users);
        const user = users.find(u => (u.name === data.name && u.number === data.password) ? u : null);
        console.log(user);
        if(user){
            users.forEach(user1 => {
                if (user1.id === user.id) {
                    user1.socketId = socket.id;
                }
            });            
            socket.emit("userLogged", user);
        }else{
            socket.emit("userNotFounded", "Please Check Your Name & Password");
        }
       
    });

    socket.on("updateLocation", ({ id, GMRegion }) => {
        console.log(id,GMRegion);
        users.forEach(user1 => {
            if (user1.id === id) {
                user1.GMRegion = GMRegion;
            }
        });     
        socket.emit("updateMap",{id,GMRegion});
    })
})

createServer.listen(4001, () => {
    console.log("Server is running... on Prot" + 4001);
})


