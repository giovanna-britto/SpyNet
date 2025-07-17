import { Server } from "socket.io";

export let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
  const clientIp = socket.handshake.address;
  console.log(`[Socket] Cliente conectado: ${socket.id} - IP: ${clientIp}`);

  socket.on("join", (userId: number) => {
    socket.join(`user-${userId}`);
  });
});

};
