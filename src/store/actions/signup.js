import * as actionTypes from './actionTypes';
import axios from '../../configs/axios';

export const signupStart = () => {
  return {
    type: actionTypes.SIGNUP_START
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

export const signupFail = (error) => {
  return {
    type: actionTypes.SIGNUP_FAIL,
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
    dispatch(signupStart());
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
      // dispatch(signupFail(err.response.data.error.message));
    });

  }
}
