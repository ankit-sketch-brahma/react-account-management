import * as actionTypes from './actionTypes';
import axios from '../../configs/axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const signupSuccess = (data) => {
  return {
    type: actionTypes.SIGNUP_SUCCESS,
    name: data.full_name,
    userType: data.user_type,
    userId: data.user_id
  }
}

export const createUserSuccess = (data) => {
  return {
    type: actionTypes.CREATE_USER_SUCCESS,
    user: data.user,
    userType: data.user_type
  }
}

export const loginSuccess = (data) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    name: data.name,
    userType: data.user_type,
    userId: data.user_id,
    token: data.token,
    isVarified: data.is_varified,
    isRequestSent: data.is_request_sent
  }
}

export const fetchUserSuccess = (data) => {
  return {
    type: actionTypes.FETCH_USERS_SUCCESS,
    users: data.users,
  }
}

export const fetchStuMarkSuccess = (data) => {
  return {
    type: actionTypes.FETCH_STUDENT_MARK_SUCCESS,
    student_marks: data.student_marks,
  }
}

export const accountVarificationRequestSuccess = () => {
  return {
    type: actionTypes.ACCOUNT_VARIFICATION_REQUEST_SUCCESS,
  }
}
export const accountVarificationSuccess = (id) => {
  return {
    type: actionTypes.ACCOUNT_VARIFICATION_SUCCESS,
    studentId: id,
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  }
}

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const signup = (data) => {
  return dispatch => {
    dispatch(authStart());
    const signupData = {
      email: data.username,
      password: data.password,
      full_name: data.name,
      user_type: data.userType
    }
    axios.post('/accounts/users/', signupData)
    .then(response => {
      console.log(response);
      dispatch(signupSuccess(response.data));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}

export const createUser = (data) => {
  return dispatch => {
    dispatch(authStart());
    let createUserData = null;
    let url = null;

    if(data.userType === "F") {
      url = '/accounts/users/add-faculty/';
      createUserData = {
        email: data.username,
        password: data.password,
        full_name: data.name,
        user_type: data.userType,
        added_by: data.userId
      }
    }
    if(data.userType === "S") {
      url = '/accounts/users/add-student/';
      createUserData = {
       email: data.username,
       password: data.password,
       full_name: data.name,
       user_type: data.userType,
       added_by: data.faculty
     }
    }
    axios.post(url, createUserData)
    .then(response => {
      console.log(response);
      dispatch(createUserSuccess(response.data));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}
export const addStudentMark = (data) => {
  return dispatch => {
    dispatch(authStart());
    const url = '/accounts/add-student-mark/';
    const postPata = {
      author: data.student,
      subject: data.subject,
      mark: data.mark
    }
    axios.post(url, postPata)
    .then(response => {
      console.log(response);
      // dispatch(createUserSuccess(response.data));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}
export const accountVarificationRequest = (studentId) => {
  return dispatch => {
    dispatch(authStart());
    const url = '/accounts/account-varification-request/';
    axios.get(url+studentId)
    .then(response => {
      console.log(response);
      dispatch(accountVarificationRequestSuccess());
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}
export const accountVarification = (studentId, userId) => {
  return dispatch => {
    dispatch(authStart());
    const url = '/accounts/varify-account/';
    const data = {
      added_by: userId
    }
    console.log("userId: ", userId);
    console.log("studentId: ", studentId);
    axios.post(url+studentId+'/', data)
    .then(response => {
      console.log(response);
      dispatch(accountVarificationSuccess(studentId));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}

export const login = (data) => {
  return dispatch => {
    dispatch(authStart());
    const loginData = {
      username: data.username,
      password: data.password,
    }
    axios.post('/accounts/auth/', loginData)
    .then(response => {
      console.log(response);
      dispatch(loginSuccess(response.data));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}

export const fetchUsers = (userId, userType) => {
  return dispatch => {
    dispatch(authStart());
    console.log(userId);
    axios.get('/accounts/fetch-users/'+userId+'?user_type='+userType)
    .then(response => {
      console.log(response);
      dispatch(fetchUserSuccess(response.data));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}
export const fetchStudentMark = (userId) => {
  return dispatch => {
    dispatch(authStart());
    console.log(userId);
    axios.get('/accounts/student-marks/'+userId)
    .then(response => {
      console.log(response);
      dispatch(fetchStuMarkSuccess(response.data));
    })
    .catch(err => {
      console.log(err);
      dispatch(authFail("Something went wrong"));
    });

  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}
