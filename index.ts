import express from "express";
const socketIo = require("socket.io");

const http = require("http");

const ip = process.env.IP || "178.17.13.115";
const port = process.env.PORT || 8500;

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: `http://${ip}:8000`,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const getApiAndEmit = (socket: any) => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("ServerTime", response);
};

let interval: any;

io.on("connection", (socket: any) => {
    console.log("New client connected", socket.id);
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

server.listen(port, ip, () => console.log(`Listening on port ${port}`));