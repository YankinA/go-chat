import { ConnStatus } from "../types";

export const SET_CONN_STATUS = 'SET_CONN_STATUS';

export const setConnStatus = (status: ConnStatus) => ({
    type: SET_CONN_STATUS,
    payload: status,
})

