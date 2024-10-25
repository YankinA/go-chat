import { call, put, takeEvery } from "redux-saga/effects";
import { FETCH_ROOMS_REQUEST, fetchRoomsSuccess, RECEIVE_ROOM, receiveRoom, SEND_ROOM } from "../actions/roomActions";
import roomApi from "../../api/roomApi";
import { createUserFailure } from "../actions/userActions";
import { getSocket } from "../../socket";
import store from "..";


  function* fetchRoomsSaga() {
    try {
      
      const rooms = yield call(roomApi.getAll);
      yield put(fetchRoomsSuccess(rooms));
    } catch (error) {
      yield put(createUserFailure(error));
    }
  }

  function* sendRoomSaga(action) {
    const socket = getSocket();
    socket.emit('room', action.payload);
}
 
 
 
  export function* watchRoomSagas() {
    yield takeEvery(SEND_ROOM, sendRoomSaga);
    yield takeEvery(FETCH_ROOMS_REQUEST, fetchRoomsSaga);
  }
  
  