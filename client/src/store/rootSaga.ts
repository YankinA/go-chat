import { call,  all, takeEvery } from 'redux-saga/effects';
import { SetStatusAction, ConnStatus } from './types';
import { watchUserSagas } from './sagas/userSagas';
import watchMessageSagas, { requestMessagesSaga } from './sagas/messageSagas';
import { SET_CONN_STATUS } from './actions/coonActions';
import { watchRoomSagas } from './sagas/roomSagas';


function* watchStatusChange(action: SetStatusAction) {
  if (action.payload === ConnStatus.Connected) {
    yield call(requestMessagesSaga);
  }
}

export default function* rootSaga() {
  yield all([
    watchUserSagas(),
    watchRoomSagas(),
    watchMessageSagas(),
    takeEvery(SET_CONN_STATUS, watchStatusChange)
  ])
}

