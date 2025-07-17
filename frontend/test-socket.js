// Script simples para testar o recebimento do evento triggerPayment via socket.io
const { io } = require("socket.io-client");

const socket = io("http://localhost:3001");
const userId = 123; // Use o mesmo userId que seu frontend está usando no usePaymentListener

socket.on("connect", () => {
  console.log("[Test] Conectado ao servidor, id:", socket.id);
  socket.emit("join", userId);
  console.log("[Test] Enviado join para userId:", userId);
});

socket.on("triggerPayment", (data) => {
  console.log("[Test] Recebido triggerPayment:", data);
  socket.disconnect();
});

socket.on("disconnect", () => {
  console.log("[Test] Desconectado do servidor");
});
