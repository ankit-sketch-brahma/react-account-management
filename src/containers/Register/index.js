import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';

import Button from '../../components/UI/Button';
import * as actions from '../../store/actions';
import urls from '../../configs/urls';
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

class Register extends Component {
  state = {
    registerForm: {
      name: genericInputConfig(),
      username: genericInputConfig(),
      password: genericInputConfig(),
      userType: genericInputConfig(),
    },
    loading: false,
    isFormValid: false
  }

  componentDidMount() {
    if(this.props.authRedirectPath !== urls.login) {
      this.props.onSetAuthRedirectPath();
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
    let submitData = {
      name: this.state.registerForm.name.value,
      username: this.state.registerForm.username.value,
      password: this.state.registerForm.password.value,
      userType: this.state.registerForm.userType.value
    }

    //make a ajax request through dispatching an action
    console.log(submitData);
    this.props.onSignup(submitData);
  }

  render() {
    // console.log(this.state);
    let authRedirect = null;
    if(this.props.isAccountCreated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
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

        <div className="radioInput" style={{marginLeft: '0px'}}>
          <label htmlFor="hod">HOD</label>
          <input type="radio" value="H" id="hod" name="userType" onChange={(e) => this.onInputChangehandler(e, "userType")}/>
        </div>
        <div className="radioInput">
          <label htmlFor="fac">Faculity</label>
          <input type="radio" value="F" id="fac" name="userType" onChange={(e) => this.onInputChangehandler(e, "userType")}/>
        </div>
        <div className="radioInput">
          <label htmlFor="stu">Student</label>
          <input type="radio" value="S" id="stu" name="userType" onChange={(e) => this.onInputChangehandler(e, "userType")}/>
        </div>
        <br/>
        <Button
          disabled={!this.state.isFormValid}
          btnType="success">Submit</Button>
      </form>
    );
    if(this.props.loading) {
      form = <p style={{textAlign:'center'}}>loading...</p>
    }
    return (
      <div className="auth">
        {authRedirect}
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAccountCreated: state.auth.userId !== null,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignup: (data) => dispatch(actions.signup(data)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath(urls.login))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
