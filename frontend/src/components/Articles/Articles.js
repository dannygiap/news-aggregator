import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Articles.css';
import { getNews, searchNews } from '../../actions/newsActions';

class Articles extends Component {
  static propTypes = {
    news: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getNews: PropTypes.func.isRequired,
    searchNews: PropTypes.func.isRequired,
  };

  componentDidMount() {
    let current = localStorage.getItem('current');
    if (current === 'search' || !current) {
      this.props.searchNews('top news');
    } else {
      this.props.getNews(current);
    }
  }

  render() {
    const { articles, searchField } = this.props.news;

    let SearchHeader;
    let CategoryHeader;
    let current = localStorage.getItem('current');

    if (current === 'search' || !current) {
      if (!searchField || searchField === 'top news') {
        SearchHeader = <h2 className="fw1 ph3 ph0-l">Today's Top News</h2>;
      } else {
        SearchHeader = (
          <h2 className="fw1 ph3 ph0-l">Search results for '{searchField}'</h2>
        );
      }
    }

    CategoryHeader = <h2 className="fw1 ph3 ph0-l">{current} News</h2>;

    return (
      <div>
        <section className="mw7 center ">
          <div>
            {current === 'search' || !current ? SearchHeader : CategoryHeader}
          </div>
          {articles.map((article) => {
            return (
              <article
                className="bt bb b--white-10"
                key={article.title}
                style={{ color: '#eeeeee' }}
              >
                <a
                  className="db pv4 ph3 ph0-l no-underline dim"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#eeeeee' }}
                >
                  <div className="w-100 flex flex-row-ns">
                    <div className=" pr3-ns mb4 mb0-ns">
                      <img src={article.imgUrl} className="db" alt="None" />
                    </div>
                    <div className="pl3-ns">
                      <h1 className="f3 fw1 mt0">{article.title}</h1>
                      <p className="f6 f5-l ">{article.description}</p>
                      <p className="f6 lh-copy mv0">{article.source}</p>
                      <p className="f6 lh-copy mv0">{article.published}</p>
                    </div>
                  </div>
                </a>
              </article>
            );
          })}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  news: state.news,
  auth: state.auth,
});
export default connect(mapStateToProps, { getNews, searchNews })(Articles);
