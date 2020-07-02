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
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import '../Login/Login.css';

const initialState = {
  modal: false,
  name: '',
  email: '',
  password: '',
  preferences: [],
  msg: null,
};
class RegisterModal extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  // USE THIS TO GRAB CATEGORY DATA AND UPDATE LOCAL STATE
  handleChange = (event) => {
    var options = event.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({ preferences: value });
  };

  onNameChange = (event) => {
    this.setState({ name: event.target.checked.name });
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSignIn = () => {
    this.props.register(this.state);
  };

  toggle = () => {
    this.props.clearErrors();
    this.setState({ modal: !this.state.modal });
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;

    if (error !== prevProps.error) {
      if (error.id === 'REGISTER_FAIL') this.setState({ msg: error.msg });
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
          Register
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="dark-text">
            Register
          </ModalHeader>
          <ModalBody className="dark-text">
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form className="p-2">
              <FormGroup>
                <Label for="exampleName">Name:</Label>
                <Input
                  type="name"
                  name="name"
                  id="exampleName"
                  placeholder="e.g. Jane Doe"
                  onChange={this.onNameChange}
                />
              </FormGroup>
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
                />
              </FormGroup>
              {/* <FormGroup check className="d-flex flex-column mb-4">
                {categories.map((category) => {
                  return (
                    <Label check className="">
                      <Input
                        type="checkbox"
                        value={category}
                        checked={false}
                        onChange={this.handleChange}
                      />{' '}
                      {category}
                    </Label>
                  );
                })}
              </FormGroup> */}
              <FormGroup>
                <Label for="exampleSelectMulti">Select Categories:</Label>
                <Input
                  type="select"
                  name="categories"
                  id="categories"
                  onChange={this.handleChange}
                  multiple
                  size="13"
                >
                  <option value="Business">Business</option>
                  <option value="Entertainment_Music">Music</option>
                  <option value="Entertainment_MovieAndTV">MovieAndTV</option>
                  <option value="Health">Health</option>
                  <option value="Politics">Politics</option>
                  <option value="Products">Products</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports_NBA">NBA</option>
                  <option value="Sports_NFL">NFL</option>
                  <option value="Sports_Soccer">Soccer</option>
                  <option value="Sports_Tennis">Tennis</option>
                  <option value="World">World</option>
                </Input>
              </FormGroup>

              <Button onClick={this.onSubmitSignIn}>Submit</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

RegisterModal.propTypes = {
  auth: PropTypes.bool,
  error: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});
export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
);
