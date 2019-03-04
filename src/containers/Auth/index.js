import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';
import './Auth.css';

class Auth extends Component {

  state = {
    username: '',
    password: ''
  }

  onInputChangehandler1 = (e) => {
    this.setState({
      username: e.target.value
    });
  }
  onInputChangehandler2 = (e) => {
    this.setState({
      password: e.target.value
    });
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    this.props.onAuth(this.state.username, this.state.password);
  }

  render() {
    // console.log(this.state);

    let form = (
      <form className="loginForm" onSubmit={this.onFormSubmit}>
        <input type="text" placeholder="username" name='username'
          value={this.state.username} onChange={this.onInputChangehandler1}/>
        <br />
        <input type="password" placeholder="password" name='password'
          value={this.state.password} onChange={this.onInputChangehandler2}/>
        <button>Login</button>
      </form>
    );
    if(this.props.loading) {
      form = <p style={{textAlign:'center'}}>loading...</p>
    }
    return (
      <div className="auth">
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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, pass) => dispatch(actions.auth(username, pass)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
