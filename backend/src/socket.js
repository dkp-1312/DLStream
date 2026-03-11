export default (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  
    // Join room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log("Joined room:", room);
    });
  
    // Send message
    socket.on("sendMessage", ({ room, message }) => {
      console.log("Message to room:", room);
      io.to(room).emit("receiveMessage", message);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
  