import { User } from "../types";

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';


export const createUserRequest = (user: Omit<User, "id">) => ({
  type: CREATE_USER,
  payload: user,
  loading: true
});

export const createUserSuccess = (user: User) => ({
  type: CREATE_USER_SUCCESS,
  payload: user,
  loading: false
});

export const createUserFailure = (error: string) => ({
  type: CREATE_USER_FAILURE,
  payload: error,
  loading: false
});
