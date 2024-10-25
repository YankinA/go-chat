import { CREATE_USER, CREATE_USER_FAILURE, CREATE_USER_SUCCESS } from "../actions/userActions";
import { UserState } from "../types";



const initialState: UserState = {
    loading: false,
    error: null,
    user: undefined
};

export const userReducer = (state = initialState, action: any): UserState => {

    switch (action.type) {
        case CREATE_USER:
            return {
                ...state,
                loading: true,
            };
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
            };
            case CREATE_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};



