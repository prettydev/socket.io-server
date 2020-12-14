import express from "express";
import { IMsg } from "./types";
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

const getServerTime = (socket: any) => {
    const response = new Date();
    socket.emit("ServerTime", response);
};

let interval: any;

io.on("connection", (socket: any) => {
    console.log("New client connected", socket.id);
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getServerTime(socket), 1000);

    socket.on('msg', (msg: IMsg) => {
        console.log(`message from ${socket.id}:${msg.prefix}:${msg.msg}`);
        socket.emit("msg", `echo from server-${msg.prefix}:${msg.msg}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

server.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));