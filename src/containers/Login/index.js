import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';

import Button from '../../components/UI/Button';
import * as actions from '../../store/actions';
import urls from '../../configs/urls';
import '../Auth/Auth.css';

class Login extends Component {
  state = {
    registerForm: {
      username: {
        value:'',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      password: {
        value:'',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
    },
    loading: false,
    isFormValid: false
  }

  componentDidMount() {
    if(this.props.isAuthenticated) {
      if(this.props.authRedirectPath !== urls.userDashboard) {
        this.props.onSetAuthRedirectPath();
      }
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
    const submitData = {
      username: this.state.registerForm.username.value,
      password: this.state.registerForm.password.value
    }
    console.log(submitData);
    //make a ajax request through dispatching an action
    this.props.onLogin(submitData);
  }

  render() {
    // console.log(this.state);
    let authRedirect = null;
    let error = null;
    if(this.props.error) {
      error = <p className="error">{this.props.error}</p>
    }

    if(this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    let form = (
      <form className="loginForm" onSubmit={this.onFormSubmit}>
        <input type="text" placeholder="username" name='username'
          value={this.state.username} onChange={(e) => this.onInputChangehandler(e, "username")}/>
        <br />
        <input type="password" placeholder="password" name='password'
          value={this.state.password} onChange={(e) => this.onInputChangehandler(e, "password")}/>

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
        {error}
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, pass) => dispatch(actions.login(username, pass)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath(urls.userDashboard))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
