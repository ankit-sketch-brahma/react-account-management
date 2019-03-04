import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import * as actions from '../../store/actions';
import urls from '../../configs/urls';
import './Header.css';
import '../../index.css';

class Header extends Component {
  render() {
    let authHeader = (
      <>
        <NavLink exact to={urls.register} className="headerBtn">Sign up</NavLink>
        <NavLink exact to={urls.login} className="headerBtn">Login</NavLink>
      </>
    );
    if(this.props.isAuthenticated) {
      authHeader = (
        <>
          <span className="hTitle"> {this.props.name} </span>
          <NavLink exact to={urls.logout} className="headerBtn">Logout</NavLink>
        </>
      )
    }
    return (
      <header className="App-header">
        <div className="container">
          {authHeader}
        </div>
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    name: state.auth.name,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
