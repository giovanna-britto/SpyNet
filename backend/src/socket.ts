import { Server } from "socket.io";

export let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("[Socket] Cliente conectado:", socket.id);

    socket.on("join", (userId: number) => {
      socket.join(`user-${userId}`);
    });
  });
};
