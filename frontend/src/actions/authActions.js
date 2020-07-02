import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
} from './types';

import { returnErrors } from './errorActions';

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  const token = localStorage.getItem('token');

  fetch('http://localhost:3001/user', {
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res._id) throw res;
      dispatch({ type: USER_LOADED, payload: res });
    })
    .catch((err) => {
      dispatch(returnErrors(err.msg, err.status));
      dispatch({ type: AUTH_ERROR });
    });
};

export const register = ({ name, email, password, preferences }) => (
  dispatch
) => {
  fetch('http://localhost:3001/register', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      preferences: preferences,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.msg) throw res;
      dispatch({ type: REGISTER_SUCCESS, payload: res });
    })
    .catch((err) => {
      dispatch(returnErrors(err.msg, err.status, 'REGISTER_FAIL'));
      dispatch({ type: REGISTER_FAIL });
    });
};

export const login = ({ email, password }) => (dispatch) => {
  fetch('http://localhost:3001/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.msg) throw res;
      dispatch({ type: LOGIN_SUCCESS, payload: res });
    })
    .catch((err) => {
      dispatch(returnErrors(err.msg, err.status, 'LOGIN_FAIL'));
      dispatch({ type: LOGIN_FAIL });
    });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const update = ({ preferences }) => (dispatch) => {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/preferences', {
    method: 'put',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify({
      preferences: preferences,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.msg) throw res;
      dispatch({ type: UPDATE_SUCCESS, payload: res });
    })
    .catch((err) => {
      dispatch(returnErrors(err.msg, err.status, 'UPDATE_FAIL'));
      dispatch({ type: UPDATE_FAIL });
    });
};
