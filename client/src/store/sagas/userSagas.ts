import { call, put, takeEvery } from "redux-saga/effects";
import userApi from "../../api/userApi";
import { CREATE_USER,  createUserFailure, createUserSuccess } from "../actions/userActions";

function* createUserSaga(action) {
    try {
      const user = yield call(userApi.create, action.payload);
      yield put(createUserSuccess(user));
    } catch (error) {
      yield put(createUserFailure(error));
    }
  }

  export function* watchUserSagas() {
    yield takeEvery(CREATE_USER, createUserSaga);
  }
