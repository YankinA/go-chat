import { combineReducers } from 'redux';
import { userReducer } from './reducer/userReducer';
import { roomReducer } from './reducer/roomReducer';
import { messageReducer } from './reducer/messageReducer';
import { connReducer } from './reducer/connReducer';


const rootReducer = combineReducers({
    userStore: userReducer,
    roomStore: roomReducer,
    messageStore: messageReducer,
    connStatus: connReducer
})

export default rootReducer;

