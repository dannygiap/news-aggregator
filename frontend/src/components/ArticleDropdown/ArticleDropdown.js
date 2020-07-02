import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './ArticleDropdown.css';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { getNews, searchNews } from '../../actions/newsActions';

class ArticleDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    getNews: PropTypes.func.isRequired,
    searchNews: PropTypes.func.isRequired,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onCategoryClick = (event) => {
    this.props.getNews(event.target.value);
  };

  onNewsSearch = () => {
    this.props.searchNews('top news');
  };

  // componentDidMount() {
  //   let current = localStorage.getItem('current');

  //   if (current) {
  //     this.props.getNews(current);
  //   } else {
  //     this.props.searchNews();
  //   }
  // }

  render() {
    const { user } = this.props.auth;
    return (
      <ButtonDropdown
        isOpen={this.state.isOpen}
        toggle={this.toggle}
        className="dropdown-container"
      >
        <DropdownToggle caret>Categories</DropdownToggle>
        <DropdownMenu className="dark">
          <DropdownItem header>Your News Categories</DropdownItem>
          {user
            ? user.preferences.map((category) => {
                return (
                  <DropdownItem
                    value={category}
                    onClick={this.onCategoryClick}
                    className="light-text"
                    key={category}
                  >
                    {category}
                  </DropdownItem>
                );
              })
            : ''}
          <DropdownItem divider />
          <DropdownItem onClick={this.onNewsSearch} className="light-text">
            Search
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { getNews, searchNews })(
  ArticleDropdown
);
