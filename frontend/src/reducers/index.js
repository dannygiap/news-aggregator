import { combineReducers } from 'redux';
import newsReducer from './newsReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
  news: newsReducer,
  error: errorReducer,
  auth: authReducer,
});
