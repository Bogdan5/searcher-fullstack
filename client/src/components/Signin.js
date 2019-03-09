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
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post('/api/users/signin', user)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data }))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSignIn}>
          <div>Email</div>
          <input
            type='text' placeholder='Email address'
            name='email' value={this.state.email}
            onChange={this.onChange}
          />
          <div>Password</div>
          <input
            type='password' placeholder='Password'
            name='password' value={this.state.password}
            onChange={this.onChange}
          />
          <input type="submit" className="btn btn-info btn-block mt-4" />
        </form>
      </div>      
    );
  }
}

export default SignIn;