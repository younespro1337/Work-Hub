import { useEffect } from 'react';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');

export const useSocket = (eventName, callback) => {
  useEffect(() => {
    const handler = (data) => {
      console.log(`Received data for event ${eventName}:`, data);
      if (callback) {
        callback(data);
      }
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName, callback]);

  return socket;
};
