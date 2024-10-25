import { takeEvery, put, call, select } from 'redux-saga/effects';
import { getSocket } from '../../socket';
import messageApi from '../../api/messageApi';
import { fetchMessagesFailure, fetchMessagesSuccess, RECEIVE_MESSAGE, receiveMessage, SEND_MESSAGE } from '../actions/messageActions';
import { State } from '../types';


const selectLastMessageId = (state: State) => {
  const messages = state.messageStore.messages
  return messages.length > 0 ? messages[messages.length - 1].id : 0
}

export function* requestMessagesSaga() {
  const lastMessageId = yield select(selectLastMessageId);

  const socket = getSocket()

  if (socket.connected) {
    socket.emit('messages', { lastMessageId });
  } else {
    yield call(fetchMessagesAfter, lastMessageId);

  }
}

function* fetchMessagesAfter(lastMessageId: string) {
  try {
    const messages = yield call(messageApi.getAllAfter, lastMessageId);
    yield put(fetchMessagesSuccess(messages));
  } catch (error) {
    yield put(fetchMessagesFailure(error));
  }
}

function* sendMessageSaga(action) {
  const socket = getSocket();
  socket.emit('message', action.payload);
}

export default function* watchMessageSagas() {
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
}

