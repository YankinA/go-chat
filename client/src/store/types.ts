import { Action } from "redux-saga";
import { SET_CONN_STATUS } from "./actions/coonActions";

export interface Room {
    id: string;
    name: string;
    lastMessage: Message
}
export interface CreateMessage {
  text: string;
  roomId: string,
  userId: string;
}

  export interface Message {
    id: string;
    text: string;
    createdAt: string;
    roomId: string,
    user: User;
  }

  export interface User {
    id: string;
    name: string;
}

export interface UserState {
  user: User;
  loading: boolean;
  error: string | null;
}

export interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

export interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export interface State {
  userStore: UserState;
  roomStore: RoomState;
  messageStore: MessageState;
  connStatus: ConnStatus;
}
export enum ConnStatus {
  Connected,
  Disconnected,
}

export interface SetStatusAction extends Action<string> {
  type: typeof SET_CONN_STATUS;
  payload: ConnStatus;
}

