const socketIo = require('socket.io');

const setupSockets = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', // Adjust to your frontend URL
      methods: ['GET', 'POST']
    }
  });

  global.io = io; // Make io globally accessible for controllers

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = setupSockets;
