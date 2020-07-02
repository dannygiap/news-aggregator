import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  NavLink,
  ModalBody,
  Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import './Login.css';

const initialState = {
  modal: false,
  email: '',
  password: '',
  msg: null,
};
class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSignIn = () => {
    this.props.login(this.state);
  };

  onKeyPress = (event) => {
    var key = event.which || event.keyCode;
    if (key === 13) {
      this.onSubmitSignIn();
    }
  };

  toggle = () => {
    this.props.clearErrors();
    this.setState({ modal: !this.state.modal });
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;

    if (error !== prevProps.error) {
      if (error.id === 'LOGIN_FAIL') this.setState({ msg: error.msg });
      else {
        this.setState({ msg: null });
      }
    }

    if (this.state.modal) {
      if (isAuthenticated) {
        this.setState(initialState);
      }
    }
  }

  render() {
    return (
      <div>
        <NavLink onClick={this.toggle} href="#" className="link p-3">
          Login
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="dark-text">
            Login
          </ModalHeader>
          <ModalBody className="dark-text">
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form className="p-2">
              <FormGroup>
                <Label for="exampleEmail">Email:</Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="e.g. JaneDoe@gmail.com"
                  onChange={this.onEmailChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Password:</Label>
                <Input
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="Enter password"
                  onChange={this.onPasswordChange}
                  onKeyPress={this.onKeyPress}
                />
              </FormGroup>

              <Button onClick={this.onSubmitSignIn}>Submit</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

LoginModal.propTypes = {
  auth: PropTypes.bool,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});
export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
