import { SEARCH_NEWS, GET_NEWS } from './types';

export const searchNews = (input) => (dispatch) => {
  let articleList = [];

  if (input === '') {
    input = null;
  }
  fetch(`${process.env.PORT}/search/${input}`)
    .then((res) => res.json())
    .then((res) => {
      res.value.forEach((element) => {
        let thumbnail;
        if (!element.image) {
          thumbnail = '';
        } else {
          thumbnail = element.image.thumbnail.contentUrl;
        }
        let article = {
          title: element.name,
          description: element.description,
          published: new Date(element.datePublished).toString(),
          source: element.provider[0].name,
          url: element.url,
          imgUrl: thumbnail,
        };
        articleList.push(article);
      });
      dispatch({
        type: SEARCH_NEWS,
        payload: {
          articles: articleList,
          searchField: input,
          current: 'search',
        },
      });
    })
    .catch((err) => console.log(err));
};

export const getNews = (category) => (dispatch) => {
  let articleList = [];
  fetch(`${process.env.PORT}/news/${category}`)
    .then((res) => res.json())
    .then((res) => {
      res.value.forEach((element) => {
        let thumbnail;
        if (!element.image) {
          thumbnail = '';
        } else {
          thumbnail = element.image.thumbnail.contentUrl;
        }
        let article = {
          title: element.name,
          description: element.description,
          published: new Date(element.datePublished).toString(),
          source: element.provider[0].name,
          url: element.url,
          imgUrl: thumbnail,
        };
        articleList.push(article);
      });
      dispatch({
        type: GET_NEWS,
        payload: {
          articles: articleList,
          current: category,
          searchField: '',
        },
      });
    })
    .catch((err) => console.log(err));
};
