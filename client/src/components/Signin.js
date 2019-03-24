import React, { Component } from 'react';
import axios from 'axios';
import '../App.js';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {},
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSignIn = (e) => {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password
    };
    axios.post('/api/users/signin', user)
      .then((res) => {
        if (res.ok) {
          return res;
        } else {
          var error = new Error('Error ' + res.status + ': ' + res.statusText);
          error.res = res;
          throw error;
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          // If login was successful, set the token in local storage
          localStorage.setItem('token', res.token);
        } else {
          var error = new Error('Error ' + res.status);
          error.response = res;
          throw error;
        }
    })
      .catch(err => this.setState({ errors: err.response.data }));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSignIn}>
          <div>Username</div>
          <input
            type='text' placeholder='Username'
            name='username' value={this.state.email}
            onChange={this.handleInputChange}
          />
          <div>Password</div>
          <input
            type='password' placeholder='Password'
            name='password' value={this.state.password}
            onChange={this.handleInputChange}
          />
          <input type="submit" />
        </form>
      </div>      
    );
  }
}

export default SignIn;