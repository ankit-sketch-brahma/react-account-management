import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';

// import Auth from '../Auth';
// import Product from '../Product';
import Header from '../../components/Header';
import UserDashboard from '../UserDashboard';
import Register from '../Register';
import Login from '../Login';
import Logout from '../Logout';

// import logo from '../../logo.svg';
import './App.css';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path='/' exact component={Register}></Route>
        <Route path='/login' exact component={Login}></Route>
        <Redirect to='/' />
      </Switch>
    );

    if(this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/logout" component={Logout}/>
          <Route path='/user-dashboard' exact component={UserDashboard}></Route>
          <Redirect to='/user-dashboard' />
        </Switch>
      );
    }
    return (
      <div className="App">
        <Header />
        <main>
          <div className="container">
            {routes}
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

export default withRouter(connect(mapStateToProps)(App));
