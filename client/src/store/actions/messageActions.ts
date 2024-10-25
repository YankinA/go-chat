import { CreateMessage, Message } from "../types";


export const FETCH_MESSAGES_AFTER = 'FETCH_MESSAGES_AFTER';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';

export const SEND_MESSAGE = 'SEND_MESSAGE';

export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES';


export const sendMessage = (message: CreateMessage) => ({ type: SEND_MESSAGE, payload: message });


export const receiveMessage = (message: Message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});

export const receiveMessages = (messages: Message[]) => ({
  type: RECEIVE_MESSAGES,
  payload: messages,
});

export const fetchMessagesAfter = (lastMessageId: number) => ({
  type: FETCH_MESSAGES_AFTER,
  payload: { lastMessageId },
});

export const fetchMessagesSuccess = (messages: Message[]) => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: messages,
});

export const fetchMessagesFailure = (error: string) => ({
  type: FETCH_MESSAGES_FAILURE,
  payload: error,
});
