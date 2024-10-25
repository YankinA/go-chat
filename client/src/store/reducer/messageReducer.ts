import { FETCH_MESSAGES_SUCCESS, RECEIVE_MESSAGE, RECEIVE_MESSAGES } from "../actions/messageActions";
import { MessageState } from "../types";



const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,

};

export const messageReducer = (state = initialState, action: any): MessageState => {

    switch (action.type) {
        case FETCH_MESSAGES_SUCCESS:
        case RECEIVE_MESSAGES:
            return {
                ...state,
                messages: [
                    ...state.messages,
                    ...action.payload.filter(
                        (msg) => !state.messages.some((m) => m.id === msg.id)
                    ),
                ],
            };
     
        case RECEIVE_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],

            };
        default:
            return state;
    }
};



