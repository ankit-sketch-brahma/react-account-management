import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import CreateUserForm from '../CreateUserForm';
import AddStudentMark from '../AddStudentMark';
import * as actions from '../../store/actions';
import '../Auth/Auth.css';
import './UserDashboard.css';
import '../../index.css';

class UserDashboard extends Component {
  state =  {
    userFormType: null,
    showUserForm: false,
    showAddMarkForm: false
  }

  resetUserCreationForm = () => {
    console.log("reset Form CLicked");
    this.setState({
      userFormType: "H",
      showUserForm: false,
      showAddMarkForm: false
    })
  }

  addUserBtnHandler = (data) => {
    if(data === "H") {
      this.setState({
        userFormType: data,
        showUserForm: false,
        showAddMarkForm: false
      });
    } else {
      if(data === "ASM") {
        this.setState({
          userFormType: data,
          showUserForm: false,
          showAddMarkForm: true
        });
      } else {
        this.setState({
          userFormType: data,
          showUserForm: true,
          showAddMarkForm: false
        });
      }
    }

  }

  componentDidMount() {
    if((this.props.userId && this.props.userType === "H") || (this.props.userId && this.props.userType === "F")) {
      this.props.onFetchUsers(this.props.userId, this.props.userType);
    }
    if(this.props.userId && this.props.userType === "S") {
      this.props.onFetchStudentMark(this.props.userId);
    }
  }

  render() {
    let usertype = null;
    if(this.props.userType) {
      if(this.props.userType === "H") {
        usertype = 'HOD';
      }
      if(this.props.userType === "F") {
        usertype = 'Faculty';
      }
      if(this.props.userType === "S") {
        usertype = 'Student';
      }
    }
    let element = null;
    let hodElement = null;
    if(this.props.userType === 'H') {
      hodElement = (
        <>
          <button className="headerBtn a-text" onClick={() => this.addUserBtnHandler('F')}>Add Faculity</button>
          <button className="headerBtn a-text" onClick={() => this.addUserBtnHandler('HFS')}>Add Student</button>
        </>
      )
    }
    let faculityElement = null;
    // let addStudentMark = null;
    if(this.props.userType === 'F') {
      faculityElement = ( <>
        <button className="headerBtn a-text" onClick={() => this.addUserBtnHandler('FS')}>Add Student</button>
        <button className="headerBtn a-text" onClick={() => this.addUserBtnHandler('ASM')}>Add Student Mark</button>
      </>
    )
      // addStudentMark = <AddStudentMark />;

    }

    if(this.state.showUserForm && !this.state.showAddMarkForm) {
      element = <CreateUserForm userFormType={this.state.userFormType} faculties={this.props.faculties} resetForm={this.resetUserCreationForm}/>
    }

    if(!this.state.showUserForm && this.state.showAddMarkForm) {
      element = <AddStudentMark  students={this.props.students}/>
    }

    // let varified = <span className="green">varified</span>;
    let accountStatusVH = <span className="green">varified</span>;
    let accountStatusH = <span className="green">varified</span>;
    let notVarified = null;

    if(this.props.userType === "H") {
      notVarified = (studentId, isRequestSent) => {
        if(isRequestSent) {
          accountStatusH = (
            <span className="blue">
              requested
              <button className="account-status-btn" onClick={() => this.props.onAccountVarify(studentId, this.props.userId)}>varify </button>
            </span>
          )
        } else {
          accountStatusH  = (
            <span className="brown">
              not varified
              <button className="account-status-btn" onClick={() => this.props.onAccountVarify(studentId, this.props.userId)}>varify </button>
            </span>
          )
        }

        return accountStatusH;
      }
    }

    let accountStatus = null;
    // let requestSentBtn = null;
    // let reqSentStatus = (
    //   <small className="blue">
    //     Request has been sent
    //   </small>
    // );
    let requestSec = (
      <small className="account-status brown">
        Account is not varified
        <button className="account-status-btn" onClick={() => this.props.onAccountVarifyRequestSent(this.props.userId)}>request </button>
      </small>
    );

    if(this.props.isRequestSent) {
      requestSec = (
        <small className="account-status blue">
          Request has been sent
        </small>
      )
    }

    let accountStatusF = <small className="brown"> Account is not varified </small>;
    let accountStatusRendererF = (isVarified, isRequestSent) => {
      if(isVarified) {
        accountStatusF = <span className="green"> varified</span>;
      } else {
        if(isRequestSent) {
         accountStatusF = <small className="blue"> request has been sent </small>;
        }
      }
      return accountStatusF;
    }

    if(this.props.userType === "S") {
      if(this.props.isVarified) {
        accountStatus = <small className="account-status green"> Varified Account</small>
      } else {
        accountStatus = requestSec
      }
    }

    let facultiesList = null;
    let studentsList = null;
    let studentMarksList = null;

    if(this.props.isAuthenticated && !this.state.showUserForm && !this.state.showAddMarkForm) {
      if(this.props.userType === "H") {
        if(this.props.faculties && this.props.students) {
          facultiesList = this.props.faculties.map((faculty, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{faculty.name}</td>
              <td>{faculty.email}</td>
            </tr>
          ));

          studentsList = this.props.students.map((student, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.added_by}</td>
              <td>{student.is_varified ? accountStatusVH : notVarified(student.user_id, student.is_request_sent)}</td>
            </tr>
          ));
        }

        element = (
          <div>
            <h2 className="user-title">Faculties</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {facultiesList}
              </tbody>
            </table>

            <h2 className="user-title">Students</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Added by</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {studentsList}
              </tbody>
            </table>
          </div>
        );
      }

      if(this.props.userType === "F" && this.props.students) {
        studentsList = this.props.students.map((student, key) => (
          <tr key={key}>
            <td>{key + 1}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td> {accountStatusRendererF(student.is_varified, student.is_request_sent)} </td>
          </tr>
        ));

        element = (
          <div>
            <h2 className="user-title">Students</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {studentsList}
              </tbody>
            </table>
          </div>
        );

      }

      if(this.props.userType === "S" && this.props.studentMarks) {
        studentMarksList = this.props.studentMarks.map((stuMark, key) => (
          <tr key={key}>
            <td>{key + 1}</td>
            <td>{stuMark.subject}</td>
            <td>{stuMark.mark}</td>
          </tr>
        ));

        element = (
          <div>
            <h2 className="user-title"> Subjects and Marks</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Subject</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {studentMarksList}
              </tbody>
            </table>
          </div>
        );
      }
    }
    console.log(this.state);
    return (
      <div className="container">
        <div className="wrapper">
          <h2 className="dash-name">
            {this.props.name} <span> >> </span> <small className="dash-type">{usertype}</small>
            {accountStatus}
          </h2>
          <p style={{margin: '0px'}}>
            <button  className="headerBtn a-text-home" onClick={() => this.addUserBtnHandler('H')}>Home</button>
            {hodElement}
            {faculityElement}
          </p>

          <div>
            {element}
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    error: state.auth.error,
    userType: state.auth.userType,
    name: state.auth.name,
    isAuthenticated: state.auth.token !== null,
    userId: state.auth.userId,
    faculties: state.auth.faculties,
    students: state.auth.students,
    studentMarks: state.auth.studentMarks,
    isVarified: state.auth.isVarified,
    isRequestSent: state.auth.isRequestSent
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchUsers: (userId, userType) => dispatch(actions.fetchUsers(userId, userType)),
    onFetchStudentMark: (userId) => dispatch(actions.fetchStudentMark(userId)),
    onAccountVarifyRequestSent: (userId) => dispatch(actions.accountVarificationRequest(userId)),
    onAccountVarify: (studentId, userId) => dispatch(actions.accountVarification(studentId, userId)),
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDashboard));
