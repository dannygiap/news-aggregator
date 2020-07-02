import { SEARCH_NEWS, GET_NEWS } from '../actions/types';

const initialState = {
  articles: [],
  searchField: '',
  current: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_NEWS:
      localStorage.setItem('current', action.payload.current);
      return {
        ...state,
        articles: action.payload.articles,
        searchField: action.payload.searchField,
        current: action.payload.current,
      };
    case GET_NEWS:
      localStorage.setItem('current', action.payload.current);
      return {
        ...state,
        articles: action.payload.articles,
        current: action.payload.current,
      };
    default:
      return state;
  }
};
