import React, {Component} from 'react';
import '../App.scss';
import axios from 'axios';
import {Link, Route, Redirect, matchPath, withRouter} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import TrashIcon from './TrashIcon';

import BackgroundPopWindow from './BackgroundPopWindow';
// import UploadWindow from './UploadWindow';
import ConfirmationWindow from './ConfirmationWindow';

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
      confirmationVisible: false,
      deletedId: false
    }
  }

  componentDidMount() {
    library.add(faTrashAlt);
    const { userID } = this.state;    
    if (userID) {
      this.getData();
    } else {
      this.props.history.push('/api/users/signin');      
    }
  }

  getData = () => {
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
          console.log('401 called; props.location.pathname: ', this.props.location.pathname);
          this.props.history.push({pathname: '/api/users/signin',
            appState: {prevPath: this.props.location.pathname}});
          // this.setState({ windowVisible: true, goToSignIn: true, pr});
        }
      });
  }

  deleteHandler = (id) => {
    // delete file
    console.log('id of file deleted ', id)
    this.setState({ deletedId: id, confirmationVisible: true });
  }

  confirm = (name) => {
    const {deletedId} = this.state;
    if (name === 'yes') {
      const bearer = 'Bearer ' + localStorage.getItem('token');
      const conf = {
        headers: { 'Authorization': bearer, deletedId }
      };
      // retrieves data from csv files uploaded in the database
      axios.delete(`/api/account/${this.state.userID}`, conf)
        .then(response => this.getData())
        .catch(err => console.log('Delete unsuccessful ', err));
    }
    this.setState({ confirmationVisible: false})
  }

  getStoredFile = (e) => {
    // this.props.getFile(e.target.id);
    this.setState({ fileID: e.target.id, goToDisplay: true });
  }

  render(){
    const {data, goToDisplay, fileID, confirmationVisible, deletedId} = this.state;
    return (
      <BackgroundPopWindow>
        {/* <UploadWindow> */}
          <Route path='/api/account' render={() => (goToDisplay ?
            <Redirect to={{pathname: `/api/datadisplay/${this.state.fileID}`, state:{fileID}}} /> : null)} />
          <h3>Uploaded files</h3>
          <div className='tableDiv'>
            <table>
              <thead>
                <tr>
                  <th className='number'>#</th>
                  <th className='name'>File name</th>
                  <th className='date'>Upload date</th>
                  <th className='delete'>Delete file?</th>
                </tr>
              </thead>
              <tbody>
                {data.map((el, index) => (
                  <tr className='rowParent' key={el._id}>
                    <td>{index}</td>
                    <td id={el._id} onClick={this.getStoredFile}>{el.description}</td>
                    <td>{new Date(el.created_at).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}</td>
                    <td>
                      <TrashIcon id={el._id} deleteHandler={this.deleteHandler} />
                      {/* <FontAwesomeIcon
                        icon={ faTrashAlt } onClick={ this.deleteHandler }
                        id={el.id}
                      /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr/>
          {/* <button type='button' onClick={handler}>Done</button> */}
          <div className='linkButton'><Link to='/'>Done</Link></div>
        {/* </UploadWindow> */}
        <ConfirmationWindow
          visibility={confirmationVisible} confirmationHandler={this.confirm}
          fileId={deletedId}
        />
      </BackgroundPopWindow>
    );
  }
}

const AccountWithRouter = withRouter(Account);

export default AccountWithRouter;
