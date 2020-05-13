import React, { Component } from 'react';
import { signup_POST } from '../actions/signup-post';

const bcrypt = require('bcryptjs');
const saltRounds = 10;


class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitFormHandler = this.submitFormHandler.bind(this);

    this.state = {
      username: '',
      password: '',
      password2: '',
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  submitFormHandler(event) {
    if (this.state.password === this.state.password2) {

      event.preventDefault();
      bcrypt.hash(this.state.password, saltRounds, async (errhash, hash) => {
        this.setState({
          password: hash,
          password2: hash
        });
        let signupPromise = await signup_POST(this.state)
        if (signupPromise === "alreadyexists") {
          alert("already exists !")
        } else
         document.location.assign('/login');
      });

    }
    else {
      alert("The passwords do not match!");
    }
  }

  render() {
    return (
      <div>

        <form onSubmit={this.submitFormHandler}>
          <label>Username: </label>
          <input type="text" name="username" ref="name" value={this.state.username} onChange={this.handleChange} /><br />
          <label>Password: </label>
          <input type="password" name="password" ref="name" value={this.state.password} onChange={this.handleChange} /><br />
          <label>Repeat password: </label>
          <input type="password" name="password2" ref="name" value={this.state.password2} onChange={this.handleChange} /><br />
          <input type="submit" value="Sign up!" />
        </form>

      </div>
    );
  }
}

export default Signup;
