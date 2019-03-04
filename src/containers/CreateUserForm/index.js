import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Button from '../../components/UI/Button';
import * as actions from '../../store/actions';
import '../Auth/Auth.css';

// generate an input field with particular configuration
const genericInputConfig = () => {
  return {
    value:'',
    valid: false,
    touched: false,
    validation: {
      required: true
    }
  }
}

class CreateUserForm extends Component {
  state = {
    registerForm: {
      name: genericInputConfig(),
      username: genericInputConfig(),
      password: genericInputConfig(),
      faculity: genericInputConfig(),
    },
    loading: false,
    isFormValid: false,
    isFaculty: true,
    hasSubmitFormClicked: false
  }

  componentDidMount() {
    if(this.props.userFormType === "F" || this.props.userFormType === "FS") {
      const currentForm = {...this.state.registerForm};
      const currentElement = {...currentForm.faculity};
      currentElement.valid = true;
      currentElement.value = '';
      currentForm.faculity = currentElement;
      this.setState({
        registerForm: currentForm
      });
    }
  }

  // Form Validation Handler
  checkValidation(value, rules) {
    let isValid = true;
    if(rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    return isValid;
  }

  onInputChangehandler = (e, inputIdentifier) => {
    const updatedRegisterForm = {
      ...this.state.registerForm
    }
    // console.log(updatedRegisterForm);
    const updatedFormElement = {
      ...updatedRegisterForm[inputIdentifier]
    }
    // console.log(updatedFormElement);

    // update the current input value
    updatedFormElement.value = e.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = this.checkValidation(updatedFormElement.value, updatedFormElement.validation);
    updatedRegisterForm[inputIdentifier] = updatedFormElement;

    // set isFormValid true if all the input elements are valid
    let isFormValid = true;
    for(let inputIdentifier in updatedRegisterForm) {
      isFormValid = updatedRegisterForm[inputIdentifier].valid && isFormValid;
    }
    this.setState({registerForm: updatedRegisterForm, isFormValid: isFormValid});
  }

  // On form submit handler
  onFormSubmit = (e) => {
    e.preventDefault();
    let submitData = '';

    if(this.props.userType === "H") {
      if(this.props.userFormType === "F") {
        submitData = {
          name: this.state.registerForm.name.value,
          username: this.state.registerForm.username.value,
          password: this.state.registerForm.password.value,
          userId: this.props.userId,
          userType: "F",
        }
      }
      if(this.props.userFormType === "HFS") {
        submitData = {
          name: this.state.registerForm.name.value,
          username: this.state.registerForm.username.value,
          password: this.state.registerForm.password.value,
          faculty: this.state.registerForm.faculity.value,
          userType: "S",
        }
      }

    }

    if(this.props.userType === "F") {
      if(this.props.userFormType === "FS") {
        submitData = {
          name: this.state.registerForm.name.value,
          username: this.state.registerForm.username.value,
          password: this.state.registerForm.password.value,
          faculty: this.props.userId,
          userType: "S",
        }
      }
    }

    console.log(submitData);
    //make a ajax request through dispatching an action
    this.props.onFormSubmit(submitData);
    if(this.props.error === null) {
      this.setState({
        hasSubmitFormClicked: true,
        registerForm: {
          name: {value: null},
          username: {value: null},
          password: {value: null},
          faculity: {value: null},
        },
        loading: false,
        isFormValid: false,
        isFaculty: true,
      });
      this.props.resetForm();
      this.setState({hasSubmitFormClicked: false});
    }
  }

  render() {
    console.log(this.state);
    let userName = '';
    if(this.props.userType === "F") {
      userName = 'Faculity';
    } else {
      userName = 'Student';
    }
    let optionElements = null;
    if(this.props.faculties) {
      optionElements = this.props.faculties.map((faculty, key) => (
        <option value={faculty.user_id} key={key}>{faculty.name}</option>
      ))
    }
    let selectField = null;
    if(this.props.userType === "H" && this.props.userFormType === "HFS") {
      selectField = (
        <select value={this.state.registerForm.faculity.value} onChange={(e) => this.onInputChangehandler(e, "faculity")}>
          <option value="0">---Select Faculity---</option>
          {optionElements}
        </select>
      )
    }

    let form = (
      <form className="loginForm" onSubmit={this.onFormSubmit}>
        <input type="text" placeholder="name" name='name'
          value={this.state.name} onChange={(e) => this.onInputChangehandler(e, "name")}/>
        <br />
        <input type="text" placeholder="username" name='username'
          value={this.state.username} onChange={(e) => this.onInputChangehandler(e, "username")}/>
        <br />
        <input type="password" placeholder="password" name='password'
          value={this.state.password} onChange={(e) => this.onInputChangehandler(e, "password")}/>
        {selectField}
        <br />
        <Button
          disabled={!this.state.isFormValid}
          btnType="success">Submit</Button>
      </form>
    );
    if(this.props.loading) {
      form = <p style={{textAlign:'center'}}>loading...</p>
    }

    let error = null;
    if(this.props.error) {
      error = <p className="error">{this.props.error}</p>
    }

    return (
      <div className="addUserForm">
        <p>Add {userName} Form</p>
        {error}
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: false,
    error: state.auth.error,
    userId: state.auth.userId,
    userType: state.auth.userType,
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFormSubmit: (data) => dispatch(actions.createUser(data)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateUserForm));
