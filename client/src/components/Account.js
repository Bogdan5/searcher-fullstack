import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {NavLink, Route, Redirect} from 'react-router-dom';

class Account extends Component {
  constructor(props){
    super(props);
    const path = this.props.location.pathname.split('/');
    const userID = path[path.length - 1];
    this.state = {
      data: [],
      userID: userID,
      goToDisplay: false,
      fileID: '',
    }
  }

  componentDidMount() {
    console.log('account mount');
    
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer },
      userID: this.state.userID,
    };
    axios.get(`/api/account/${this.state.userID}`, conf)
      .then((response) => {
        console.log('account get response: ', response);
        this.setState({data: response.data });
      })
      .catch((err) => {
        console.log('err', typeof err.response.status);
        if(err.response.status === 401) {
          console.log('401 called')
          // this.setState({ windowVisible: true, goToSignIn: true, pr});
        }
      });
  }
  // const {accData, getFile} = props;
  // console.log('account rendered');
  // const handler = () => {
  //   props.accountExit();
  // }



  getStoredFile = (e) => {
    console.log('name of file clicked: ', e.target.id);
    this.props.getFile(e.target.id);
    this.setState({ fileID: e.target.id, goToDisplay: true });
  }

  render(){
    const {data, goToDisplay, fileID} = this.state;
    return (
      <div>
        <Route path='/api/account' render={() => (goToDisplay ?
          <Redirect to={{path: `/api/datadisplay/${this.state.fileID}`, state:{fileID}}} /> : null)}  />
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
                <td id={el._id} onClick={this.getStoredFile}>{el.description}</td>
                <td>{el.created_at}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr/>
        {/* <button type='button' onClick={handler}>Done</button> */}
        <NavLink to={`/api/datadisplay/${this.state.fileID}`}>Done</NavLink>
      </div>
    );
  }
}

export default Account;
