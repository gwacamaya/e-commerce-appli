import React, { Component } from 'react';
import { login_POST } from '../actions/login-post';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitFormHandler = this.submitFormHandler.bind(this);

    this.state = {
      username: '',
      password: '',
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async submitFormHandler(event) {
    event.preventDefault();

   await login_POST(this.state);
    let token = sessionStorage.getItem('jwtToken');
      if(!token || token === '') {
        return;
    }
    token = JSON.parse(token);
    console.log(token)
    if(token.ClientName === 'admin'){
        document.location.assign('/admin_interface')
    }else{
      document.location.assign('/customer')
    }
  }


  render() {
    return (
        <div>
          <h2>Login</h2>     

          <form onSubmit={this.submitFormHandler}>
            <label>Username: </label>
              <input type="text" name="username" ref="name" value={this.state.username} onChange={this.handleChange} /><br/>
            <label>Password: </label>
              <input type="password" name="password" ref="name" value={this.state.password} onChange={this.handleChange}/><br/>     
            <input type="submit" value="Sign in!" />
          </form>  
        </div>
        );
  }
}

export default Login;