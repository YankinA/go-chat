import { SET_CONN_STATUS } from "../actions/coonActions";
import { ConnStatus } from "../types";

export const connReducer = (state = ConnStatus.Disconnected, action) => {
    switch (action.type) {
        case SET_CONN_STATUS:
            return action.payload;
        default:
            return state;
    }
}