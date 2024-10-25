import { RECEIVE_MESSAGE, RECEIVE_MESSAGES } from "../actions/messageActions";
import { FETCH_ROOMS_FAILURE, FETCH_ROOMS_REQUEST, FETCH_ROOMS_SUCCESS, RECEIVE_ROOM } from "../actions/roomActions";
import { RoomState } from "../types";

const initialState: RoomState = {
    rooms: [],
    loading: false,
    error: null,
};

export const roomReducer = (state = initialState, action: any): RoomState => {

    switch (action.type) {
        case FETCH_ROOMS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_ROOMS_SUCCESS:
            return {
                ...state,
                loading: false,
                rooms: action.payload,
            };
        case FETCH_ROOMS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case RECEIVE_ROOM:
            return {
                ...state,
                rooms: [action.payload, ...state.rooms],
            };
        case RECEIVE_MESSAGE:
            return {
                ...state,
                rooms: state.rooms.map(room => action.payload.roomId === room.id ? { ...room, lastMessage: action.payload } : room)

            };
        case RECEIVE_MESSAGES:
            
            return {
                ...state,
                rooms: state.rooms.map(room => {
                    const updatedRoom = action.payload.findLast(payloadItem => payloadItem.roomId === room.id);
                    return updatedRoom ? { ...room, lastMessage: updatedRoom } : room;
                })

            }
        default:
            return state;
    }
};



