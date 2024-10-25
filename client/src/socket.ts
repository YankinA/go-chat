import { Message, ConnStatus } from './store/types';
import store from './store';
import { receiveMessage, receiveMessages } from './store/actions/messageActions';
import { setConnStatus } from './store/actions/coonActions';
import { receiveRoom } from './store/actions/roomActions';

class WebSocketClient {

  socket: WebSocket;
  eventHandlers: {};
  connected: boolean;
  
  constructor(url) {
    window.addEventListener('offline', () => {
      this.close()
      
    });

    this.socket = new WebSocket(url);
    this.eventHandlers = {};
    this.connected = false;

    this.socket.onopen = () => {
      console.log("socket_connected");
      this.connected = true;
      store.dispatch(setConnStatus(ConnStatus.Connected));
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (this.eventHandlers[message.type]) {
        console.log(`Handling event: ${message.type}`);
        this.eventHandlers[message.type](message.data);
      } else {
        console.log(`No handler for event: ${message.type}`);
      }
    };

    this.socket.onclose = () => {
      console.log("socket_disconnected");

      this.connected = false;
      store.dispatch(setConnStatus(ConnStatus.Disconnected));
    };

    this.socket.onerror = (error) => {
      console.log(error);
      this.connected = false;
      store.dispatch(setConnStatus(ConnStatus.Disconnected));
    };
  }

  on(eventType, handler) {
    if (typeof handler !== 'function') {
      console.error(`Handler for event ${eventType} is not a function`);
      return;
    }
    this.eventHandlers[eventType] = handler;
    console.log(`Registered handler for event: ${eventType}`);
  }

  emit(eventType, data) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.connected = true;
      this.socket.send(JSON.stringify({ type: eventType, data }));
    } else {
      this.connected = false;
    }
  }

  close() {
    this.socket.close();
  }
}

let socket: WebSocketClient;

export const connectToSocket = (userId: string) => {
  socket = new WebSocketClient("ws://" + 'localhost:8080' + "/ws?userId=" + userId);

  socket.on('messages', (messages: Message[]) => {
    store.dispatch(receiveMessages(messages));
  })


  socket.on("room", (room) => {
    store.dispatch(receiveRoom(room));
  });

  socket.on("message", (message) => {
    store.dispatch(receiveMessage(message))
  })
};

export const getSocket = () => {
  return socket;
};


