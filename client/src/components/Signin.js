import React, { Component } from 'react';
import axios from 'axios';
import '../App.js';
import {withRouter} from 'react-router-dom';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {},
      signInSuccess: false,
      prevPath: '/'
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    console.log('signin rendered, authenticated: ', this.props.authenticated);
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
    console.log('history: ', this.props);
    axios.post('/api/users/signin', user)
      .then((res) => {
        console.log('res from post signin', res);
        // const {username, userID} = res.data;
        if (res.data.success) {
          console.log('if true; prevPath: ', this.props);
          this.props.isAuthenticated(true, res.data.userID);
          localStorage.setItem('token', res.data.token);
          if (this.props.location.appState) {
            this.props.history.push(this.props.location.appState.prevPath);
          } else {
            this.props.history.push('/');
          }
        } else {
          console.log('if false');
          var error = new Error('Error ' + res.status + ': ' + res.statusText);
          error.res = res;
          throw error;
        }
      })
      .catch(err => {
        console.log('Error: ', err)
        this.setState({ errors: err.response.data });
      });
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

const SignInWithRouter = withRouter(SignIn);

export default SignInWithRouter;