import React, { Component } from 'react';
import axios from 'axios';
import '../App.js';
import {withRouter} from 'react-router-dom';

class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameLogin: '',
      passwordLogin: '',
      usernameRegister: '',
      emailRegister: '',
      passwordRegister: '',
      passwordRegister2: '',
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
      username: this.state.usernameLogin,
      password: this.state.passwordLogin
    };
    axios.post('/api/users/signin', user)
      .then((res) => {
        // const {username, userID} = res.data;
        if (res.data.success) {
          this.props.isAuthenticated(true, res.data.userID);
          localStorage.setItem('token', res.data.token);
          if (this.props.location.appState) {
            this.props.history.push(this.props.location.appState.prevPath);
          } else {
            this.props.history.push('/');
          }
        } else {
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

  onSignUp = (e) => {
    e.preventDefault();
    const newUser = {
      username: this.state.usernameRegister,
      email: this.state.emailRegister,
      password: this.state.passwordRegister,
      password2: this.state.passwordRegister2
    }
    axios.post('/api/users/signup', newUser)
    .then((res) => {
        console.log('1', res.data);
        if (res.data.success) {
          this.props.isAuthenticated(true, res.data.userID);
          localStorage.setItem('token', res.data.token);
          if (this.props.location.appState) {
            this.props.history.push(this.props.location.appState.prevPath);
          } else {
            this.props.history.push('/');
          }
      } else {
        console.log('3');
        var error = new Error('Error ' + res.status + ': ' + res.statusText);
        error.res = res;
        throw error;
      }
    })
    .catch(err => {
      console.log('Error is ', err);
      this.setState({ errors: err.response.data });
    });
  }

  render() {
    return (
      <div  className="authenticate">
        <div className="authenticateContainer">
          <div>
            <form onSubmit={this.onSignIn}>
              <label htmlFor="usernameLogin" >Username</label>
              <br/>
              <input
                type='text' placeholder='Username'
                name='usernameLogin' value={this.state.email}
                onChange={this.handleInputChange}
              />
              <br/>
              <label htmlFor="passwordLogin" >Password</label>
              <br/>
              <input
                type='password' placeholder='Password'
                name='passwordLogin' value={this.state.password}
                onChange={this.handleInputChange}
              />
              <br/>
              <input type="submit" />
            </form>
          </div>
          <div>
            <form noValidate onSubmit={this.onSignUp}>
              <label htmlFor="usernameRegister" >Name</label>
              <br/>
              <input
                type='text' placeholder='Name'
                name='usernameRegister' value={this.state.nameUser}
                onChange={this.handleInputChange}
              />         
              <br/>
              <label htmlFor="emailRegister" >Email</label>
              <br/>
              <input
                type='text' placeholder='Email address'
                name='emailRegister' value={this.state.email}
                onChange={this.handleInputChange}
              />
              <br/>
              <label htmlFor="passwordRegister" >Password</label>
              <br/>
              <input
                type='password' placeholder='Password'
                name='passwordRegister' value={this.state.password}
                onChange={this.handleInputChange}
              />
              <br/>
              <label htmlFor="passwordRegister2" >Confirm password</label>
              <br/>
              <input
                type='password' placeholder='Password'
                name='passwordRegister2' value={this.state.password2}
                onChange={this.handleInputChange}
              />
              <br/>
              <input type="submit" />
            </form>
          </div>
        </div>      
      </div>
    );
  }
}

const AuthenticateWithRouter = withRouter(Authenticate);

export default AuthenticateWithRouter;