import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
// import {NavLink} from 'react-router-dom';

class Account extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer },
      userID: this.state.userID,
    };
    axios.get(`/api/account/${this.props.userID}`, conf)
      .then((response) => {
        console.log('account get response: ', response.data);
        this.setState({data: response.data });
      })
      .catch((err) => {
        console.log('err', typeof err.response.status);
        if(err.response.status === 401) {
          console.log('401 called')
          this.setState({ windowVisible: true, goToSignIn: true, prevPath: '/api/account' });
        }
      });
  }
  // const {accData, getFile} = props;
  // console.log('account rendered');
  // const handler = () => {
  //   props.accountExit();
  // }



  // const getStoredFile = (e) => {
  //   console.log('name of file clicked: ', e.target.id);
  //   getFile(e.target.id);
  // }

  render(){
    const {data} = this.state;
    return (
      <div>
        <h3>Uploaded files</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>File name</th>
              <th>Upload date</th>
              <th>Delete file?</th>
            </tr>
          </thead>
          <tbody>
            {data.map((el, index) => (
              <tr key={el._id}>
                <td>{index}</td>
                <td id={el._id} onClick={getStoredFile}>{el.description}</td>
                <td>{el.created_at}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr/>
        <button type='button' onClick={handler}>Done</button>
      </div>
    );
  }
}

export default Account;
