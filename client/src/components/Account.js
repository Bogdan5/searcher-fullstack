import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {Link, Route, Redirect, matchPath} from 'react-router-dom';

import BackgroundPopWindow from './BackgroundPopWindow';
import UploadWindow from './UploadWindow';

class Account extends Component {
  constructor(props){
    super(props);
    const match = matchPath(this.props.location.pathname,{
      path: '/api/account/:id'
    });
    this.state = {
      data: [{
        _id: '',
        description: '',
        creatd_at: new Date(),
      }],
      userID: match.params.id,
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
        this.setState({data: response.data });
      })
      .catch((err) => {
        if(err.response.status === 401) {
          console.log('401 called')
          // this.setState({ windowVisible: true, goToSignIn: true, pr});
        }
      });
  }

  getStoredFile = (e) => {
    // this.props.getFile(e.target.id);
    this.setState({ fileID: e.target.id, goToDisplay: true });
  }

  render(){
    const {data, goToDisplay, fileID} = this.state;
    return (
      <BackgroundPopWindow>
        <UploadWindow>
          <Route path='/api/account' render={() => (goToDisplay ?
            <Redirect to={{pathname: `/api/datadisplay/${this.state.fileID}`, state:{fileID}}} /> : null)} />
          <h3>Uploaded files</h3>
          <div className='tableDiv'>
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
          </div>
          <hr/>
          {/* <button type='button' onClick={handler}>Done</button> */}
          <Link to={`/api/datadisplay/${this.state.fileID}`}>Done</Link>
        </UploadWindow>
      </BackgroundPopWindow>
    );
  }
}

export default Account;
