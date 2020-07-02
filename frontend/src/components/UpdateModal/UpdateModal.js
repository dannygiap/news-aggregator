import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  DropdownItem,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { update } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import '../Login/Login.css';
import '../ArticleDropdown/ArticleDropdown.css';

class UpdateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      preferences: this.props.auth.user.preferences,
      msg: null,
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  handleChange = (event) => {
    var options = event.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    console.log(value);
    this.setState({ preferences: value });
  };

  onSubmitUpdate = () => {
    this.props.update(this.state);
    this.toggle();
  };

  toggle = () => {
    this.props.clearErrors();
    this.setState({ modal: !this.state.modal });
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (error !== prevProps.error) {
      if (error.id === 'UPDATE_FAIL') this.setState({ msg: error.msg });
      else {
        this.setState({ msg: null });
      }
    }
  }

  render() {
    let categories = [
      'Business',
      'Entertainment_Music',
      'Entertainment_MovieAndTV',
      'Health',
      'Politics',
      'Products',
      'Science',
      'Technology',
      'World',
      'Sports_NBA',
      'Sports_NFL',
      'Sports_Soccer',
      'Sports_Tennis',
    ];
    return (
      <div>
        <DropdownItem onClick={this.toggle} className="light-text">
          Update preferences
        </DropdownItem>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="dark-text">
            Update category preferences
          </ModalHeader>
          <ModalBody className="dark-text">
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form className="p-2">
              <FormGroup>
                <Label for="exampleSelectMulti">Select Categories:</Label>
                <Input
                  type="select"
                  name="categories"
                  id="categories"
                  onChange={this.handleChange}
                  multiple
                  size="13"
                  defaultValue={this.state.preferences}
                >
                  {categories.map((category) => {
                    return (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              <Button onClick={this.onSubmitUpdate} className="mr-3">
                Submit Changes
              </Button>
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});
export default connect(mapStateToProps, { update, clearErrors })(UpdateModal);
