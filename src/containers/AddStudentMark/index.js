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

class AddStudentMark extends Component {
  state = {
    registerForm: {
      student: genericInputConfig(),
      subject: genericInputConfig(),
      mark: genericInputConfig(),
    },
    loading: false,
    isFormValid: false
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
      student: this.state.registerForm.student.value,
      subject: this.state.registerForm.subject.value,
      mark: this.state.registerForm.mark.value,
    }


    console.log(submitData);
    //make a ajax request through dispatching an action
    this.props.onAddStudentMark(submitData);
  }

  render() {
    console.log(this.state);
    let optionElements = null;
    if(this.props.students) {
      optionElements = this.props.students.map((student, key) => (
        <option value={student.user_id} key={key}>{student.name}</option>
      ))
    }

    let form = (
      <form className="loginForm" onSubmit={this.onFormSubmit}>
        <div className="markInputWrapper">
          <input type="text" placeholder="subject" name='subject'
            value={this.state.registerForm.subject.value} onChange={(e) => this.onInputChangehandler(e, "subject")}/>

          <input type="text" placeholder="mark" name='mark'
              value={this.state.registerForm.mark.value} onChange={(e) => this.onInputChangehandler(e, "mark")}/>
        </div>
        <select value={this.state.registerForm.student.value} onChange={(e) => this.onInputChangehandler(e, "student")}>
          <option value="0">---Select Student---</option>
          {optionElements}
        </select>
        <Button
          disabled={!this.state.isFormValid}
          btnType="success">Submit</Button>
      </form>
    );
    let error = null;
    if(this.props.error) {
      error = <p className="error">{this.props.error}</p>
    }
    return (
      <div className="addUserForm">
        <p>Add Student Mark Form</p>
        {error}
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    // loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddStudentMark: (data) => dispatch(actions.addStudentMark(data)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddStudentMark));
