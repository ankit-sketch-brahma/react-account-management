import * as actionTypes from '../actions/actionTypes';


const initialState = {
  name: null,
  userId: null,
  token: null,
  userType: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
  faculties: [],
  students: [],
  studentMarks: [],
  isVarified: null,
  isRequestSent: null
};


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        name: action.name,
        userId: action.userId,
        userType: action.userType,
        error: null,
        loading: false
      }
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        name: action.name,
        userId: action.userId,
        token: action.token,
        userType: action.userType,
        isVarified: action.isVarified,
        error: null,
        loading: false,
        isRequestSent: action.isRequestSent
      }
    case actionTypes.CREATE_USER_SUCCESS:
      if(action.userType === "F") {
        return {
          ...state,
          faculties: [...state.faculties, action.user]
        }
      } else {
        return {
          ...state,
          students: [...state.students, action.user]
        }
      }
    case actionTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        faculties: action.users.faculties,
        students: action.users.students,
        loading: false,
        error: null
      }
    case actionTypes.FETCH_STUDENT_MARK_SUCCESS:
      return {
        ...state,
        studentMarks: action.student_marks,
      }
    case actionTypes.ACCOUNT_VARIFICATION_SUCCESS:
      let currentState = {...state};
      let currentAllStudents = [...currentState.students];
      let currentStudent = null;
      let index = null;
      currentAllStudents.forEach((cuStu, key) => {
        if(cuStu.user_id === action.studentId) {
          currentStudent = cuStu;
          index = key;
        }
      });
      if(currentStudent) {
        currentStudent.is_varified = true;
        currentAllStudents[index] = currentStudent;
      }
      console.log(currentStudent);
      return {
        ...state,
        students: currentAllStudents,
      }
    case actionTypes.ACCOUNT_VARIFICATION_REQUEST_SUCCESS:
      return {
        ...state,
        isRequestSent: true
      }
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null,
        name: null,
        userType: null
      }
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return {
        ...state,
        authRedirectPath: action.path
      }
    default: return state;
  }
}


export default reducer;
