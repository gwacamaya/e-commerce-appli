import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Customer from './components/customer/Customer';
import AdminInterface from './components/AdminInterface';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ClientName: '',
      LoggedIn: false,
      token: null
    }
  }

  componentDidMount() {

    let token = sessionStorage.getItem('jwtToken');
    if (!token || token === '') {
      return;
    }
  
    let token_obj = JSON.parse(token);  
    this.setState({
      ClientName: token_obj.ClientName,
      LoggedIn: true,
      token: token_obj.token
    });
    return;
  }



  render() {
    return (
      <Router>
        <div style={{ padding: '0.8em' }}>
          <h1>Welcome to CSJJ app!</h1>
          <h4>{DisplaySignUpPhrase(this.state.LoggedIn)}</h4>
          <p> <strong>User name: </strong> {this.state.ClientName}</p>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
              {DisplayLoginLink(!this.state.LoggedIn)}
              {DisplaySignupLink(!this.state.LoggedIn)}
            </ul>
          </nav>
          <hr />
          <Switch>
            <Route exact path='/' />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />            
            <Route exact path="/customer" component={Customer}></Route>
            <Route exact path='/admin_interface' component={AdminInterface} />
          </Switch>
        </div>
      </Router>
    );
  }
}



function DisplaySignUpPhrase(loggedin) {
  if (loggedin) {
    return null;
  }
  return (
    <div>Sign up or login to make orders.</div>
  );
}
function DisplayLoginLink(loggedin) {
  if (!loggedin) {
    return null;
  }
  return (

    <li><Link to={'/login'} className="nav-link">Login</Link></li>
  );
}

function DisplaySignupLink(loggedin) {
  if (!loggedin) {
    return null;
  }
  return (

    <li><Link to={'/signup'} className="nav-link">Sign up</Link></li>
  );
}

export default App;

