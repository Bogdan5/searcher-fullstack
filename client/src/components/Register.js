import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }
    axios.post('/api/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data }))
  }

  render() {
    return (
      <div>
        <form noValidate onSubmit={this.onSubmit}>
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
          <div>Confirm password</div>
          <input
            type='password' placeholder='Password'
            name='password2' value={this.state.password}
            onChange={this.handleInputChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  } 
}

export default Register;
