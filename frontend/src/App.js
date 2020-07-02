import React, { Component } from 'react';
import './App.css';
import AppNavbar from './components/Navigation/AppNavbar';
import ArticleDropdown from './components/ArticleDropdown/ArticleDropdown';
import Articles from './components/Articles/Articles';
import SearchBar from './components/SearchBar/SearchBar';
import { loadUser } from './actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from './store';

// import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    news: PropTypes.object.isRequired,
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <div>
        <AppNavbar />
        {this.props.auth.isAuthenticated ? (
          <ArticleDropdown />
        ) : (
          <h3 className="text-center m-1 mb-4" style={{ color: '#4ecca3' }}>
            Log in for a more customized news feed!
          </h3>
        )}
        {this.props.auth.isAuthenticated &&
        this.props.news.current === 'search' ? (
          <SearchBar />
        ) : null}
        <Articles />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  news: state.news,
});
export default connect(mapStateToProps)(App);
