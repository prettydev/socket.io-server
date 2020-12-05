import express from "express";
const socketIo = require("socket.io");

const http = require("http");

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


let interval: any;

io.on("connection", (socket: SocketIO.Socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = (socket: SocketIO.Socket) => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("ServerTime", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));