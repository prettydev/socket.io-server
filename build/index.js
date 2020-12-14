"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socketIo = require("socket.io");
const http = require("http");
const port = process.env.PORT || 8500;
const app = express_1.default();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        methods: ["GET", "POST"]
    }
});
const getApiAndEmit = (socket) => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("ServerTime", response);
};
let interval;
io.on("connection", (socket) => {
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
server.listen(port, () => console.log(`Listening on port ${port}`));
