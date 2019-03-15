import React, { Component } from 'react';
import axios from 'axios';
import '../App.js';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
    }

    console.log(this.state);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSignIn = (e) => {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post('/api/users/signin', user)
      .then(res => {
        this.props.signedIn();
      })
      .catch(err => this.setState({ errors: err.response.data }));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSignIn}>
          <div>Email</div>
          <input
            type='text' placeholder='Email address'
            name='email' value={this.state.email}
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