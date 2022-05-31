import http from 'http';
import app from './app';
import './config/db';

const PORT = process.env.PORT || 3000;

let server: http.Server = http.createServer(app);

server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
    console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', unexpectedErrorHandler);