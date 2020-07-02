import React, { Component } from 'react';
import './SearchBar.css';
import { connect } from 'react-redux';
import { searchNews } from '../../actions/newsActions';
import PropTypes from 'prop-types';

class SearchBar extends Component {
  state = {
    input: '',
  };

  onSearchClick = () => {
    if (this.state.input.length !== 0) {
      this.props.searchNews(this.state.input);
    } else if (
      this.state.input.length === 0 &&
      this.props.news.searchField !== 'top news'
    ) {
      this.props.searchNews();
    }
  };

  onKeyPress = (event) => {
    var key = event.which || event.keyCode;
    if (key === 13) {
      this.onSearchClick();
    }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  // componentDidMount() {
  //   this.props.searchNews(this.props.news.searchField);
  // }

  render() {
    return (
      <div className="search-container">
        <button onClick={this.onSearchClick} className="button">
          <i className="material-icons icon">search</i>
        </button>
        <input
          type="search"
          placeholder="search for news..."
          onChange={this.onInputChange}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  searchNews: PropTypes.func.isRequired,
  news: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  news: state.news,
});
export default connect(mapStateToProps, { searchNews })(SearchBar);
