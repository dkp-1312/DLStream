let io;
const userSocketMap = {}; // {userId: socketId}

export const initSocketStore = (ioInstance) => {
  io = ioInstance;
};

export const registerUserSocket = (userId, socketId) => {
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socketId;
    console.log(`User ${userId} paired with socket ${socketId}`);
  }
};

export const unregisterUserSocket = (userId) => {
  if (userId) {
    delete userSocketMap[userId];
    console.log(`User ${userId} unpaired from mapping`);
  }
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const emitToUser = (userId, event, data) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId && io) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false;
};

export { io };
