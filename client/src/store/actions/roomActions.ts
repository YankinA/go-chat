import { Room } from "../types";

export const CREATE_ROOM = 'CREATE_ROOM';
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS';
export const CREATE_ROOM_FAILURE = 'CREATE_ROOM_FAILURE';

export const FETCH_ROOMS_REQUEST = 'FETCH_ROOMS_REQUEST';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_FAILURE = 'FETCH_ROOMS_FAILURE';

export const SEND_ROOM = 'SEND_ROOM';

export const RECEIVE_ROOM = 'RECEIVE_ROOM';


export const createRoomRequest = (room: Room) => ({
  type: CREATE_ROOM,
  payload: room,
});

export const createRoomSuccess = (room: Room) => ({
  type: CREATE_ROOM_SUCCESS,
  payload: room,
});

export const createRoomFailure = (error: string) => ({
  type: CREATE_ROOM_FAILURE,
  payload: error,
});


export const fetchRoomsRequest = () => ({
  type: FETCH_ROOMS_REQUEST,
});

export const fetchRoomsSuccess = (rooms: Room[]) => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: rooms,
});

export const fetchRoomsFailure = (error: string) => ({
  type: FETCH_ROOMS_FAILURE,
  payload: error,
});

export const sendRoom = (room: Omit<Room, "id" | "lastMessage">) => ({ type: SEND_ROOM, payload: room });

export const receiveRoom = (room: Room) => ({
  type: RECEIVE_ROOM,
  payload: room,
});
