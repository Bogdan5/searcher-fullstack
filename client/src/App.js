import React, { Component } from 'react';
import axios from 'axios';
import { Switch, Route, NavLink } from 'react-router-dom';
// import uuid from "uuid";

// component that displays the data retrieved from server
import DataDisplay from './components/DataDisplay';
// navigation bar
import NavBar from './components/NavBar';
// sign in form
import AuthenticateWithRouter from './components/Authenticate.js';
// upload file form
import Upload from './components/Upload';
// shows the uploaded files by an user
import AccountWithRouter from './components/Account';
// initial options
import StartScreen from './components/StartScreen';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.appRef = React.createRef();
    this.state = {
      listCards: [{ // list of all the conditions cards that include conditional buttons
        id: 0, // id to identify each card
        field: 'all', // on what columns of the data the list of operations apply
        listElements: [],
        listOperations: [], // what conditions aply to the data - helps sort
      }],
      cardSelected: 0, // card that is currently selected to work on
      keyword: '', // content of the keyword input text field
      inputVisibility: 'hidden', // in the second Keyboard, whether the position input is visible
      keywordButtonClicked: '', // name of button clicked in the keyword(2nd) Keyboard
      active: [], // array of buttons active
      position: 0,
      idConditional: 0,
      menuVisible: false,
      mergerArray: [null, null, null],
      data: {},
      windowKind: 'upload',
      email: '',
      userID: null,
      username: '',
      authenticated: false,
      anonymous: true,
      fileID: '',
      goToDisplay: false,
      prevPath: '/',
    };
  }

  componentDidMount() {
    // this.textInput.current.focus();
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    // tests if the user is signed in - if not, redirects to sign in
    axios.get('/test', conf)
      .then((res) => {
        this.setState({ authenticated: true, username: res.data.username, userID: res.data._id });
        })
      .catch(err => {
        console.log('Error:', err.response.status);
        this.setState({authenticate: false});
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({ prevPath: this.props.location.pathname});
    }
  }

  // retrieves the keyword from the input form
  textHandler = (e) => {
    this.setState({ keyword: e.target.value });
  };

  // retrieves the position number
  positionHandler = (e) => {
    this.setState({ position: e.target.value });
  }
 
   // updateHistory = () => {
   //   const { historyElements, historyOperations, listElements, listOperations } = this.state;
   //   this.setState({
   //     historyElements: historyElements.concat(listElements),
   //     historyOperations: historyOperations.concat(listOperations),
   //   });
   // }

  // handles clicks on the menu - calls merger to merge conditional buttons
  menuClickHandler = (name) => {
    const { mergerArray } = this.state;
    this.setState({ menuVisible: false });
    if (mergerArray[0] !== null) {
      const mer = [...mergerArray];
      mer[1] = name;
      // console.log('mergerArray ' + this.state.mergerArray);
      if (name === 'NOT') {
        this.merger(mergerArray[0], 'NOT');
      } else {
        this.setState({ mergerArray: mer });
      }
    }
  } 

   ///////////////////////////////////////////////////Routing methods////////////////////////////////////////
   isAuthenticated = (authenticated, userID) => this.setState({authenticated, userID});

  // openUploadWindow = () => {
  //   this.setState({ windowVisible: true });
  // }

  // closeUploadWindow = () => {
  //   this.setState({ windowVisible: false, uploadSuccesful: false,
  //     accountView: false, goHome: true, goUpload: false });
  // }

  //  navbarClickHandler = (name) => {
  //    switch (name) {
  //     case 'Upload files':
  //       this.setState({ windowKind: 'upload', windowVisible: true });
  //       console.log('Upload clicked', this.state.windowKind);
  //       break;
  //     case 'Sign up':
  //       this.setState({ windowKind: 'signup', windowVisible: true });
  //       break;
  //     case 'Sign in':
  //       this.setState({ windowKind: 'signin', windowVisible: true });
  //       break;
  //     default:

  //    }
  //  }

  // uploadClickedNav = () => {
  //   this.setState({ uploaded: false });
  //   this.openUploadWindow();
  // }

  // uploadSigned = () => {
  //   this.setState({ windowVisible: true, goUpload: true, goHome: false, displayData: false });
  // }

  // // called when 'Sign up' is clicked in Register component
  // registered = () => {
  //   this.setState({ authenticated: true, windowVisible: false });
  // }

  // // called when 'Sign in' is clicked in SignIn component
  // signedIn = (username, userID) => {
  //   this.setState({ authenticated: true, userID, username, windowVisible: false, goToSignIn: false,
  //     prevPath: null });
  // }

  // uploadCall = (id) => {
  //   console.log('uploadSuccesfulCall - id: ', id);
  //   this.setState({ uploadedID: id, uploadSuccesful: true });
  // }

  // // after click on 'Sign in' button in the Navbar opens the 
  // openSignInNav = () => {
  //   this.setState({ uploaded: false, windowVisible: true, goHome: false });
  // }

  // openSignUpNav = () => {
  //   this.setState({ uploaded: false, windowVisible: true, goHome: false });
  // }

  // accountExit = () => {
  //   this.setState({ accountView: false, windowVisible: false, goHome: true, goUpload: false });
  // }

  // optChosen = (option) => {
  //   switch(option){
  //     case 'uploadAnon':
  //       this.setState({anonymous: true});
  //       break;
  //     case 'uploadSign':
  //       this.setState({anonymous: false});
  //       break;
  //     case 'account':
  //       console.log('before viewAccount fired');
  //       this.viewAccount();
  //       break;
  //     default:
  //   }

  //   this.setState({ optionChosen: option, startScreenDisplay: false })
  // }

  // }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////RENDER////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { authenticated, userID, username, prevPath } = this.state;
    console.log('username ', username);
    return (
      <div className='bodyContainer'>
{/* -------------------------------------navbar---------------------------------------------------- */}
        <NavBar>
          <NavLink to='/' exact={true} activeClassName={'active'}>Home</NavLink>
          <NavLink to='/api/upload-csv'  activeClassName={'active'}>Upload file without signing in</NavLink>
          <NavLink  activeClassName={'active'}
            to={'/api/upload-csv'}>Upload file</NavLink>
          <Route render={() => (authenticated ? null :
            <NavLink to='/api/users/authenticate'  activeClassName={'active'}>Sign in</NavLink>) } />
          <Route render={() => (authenticated ? null :
            <NavLink to='/api/users/authenticate'  activeClassName={'active'}>Sign up</NavLink>)} />         
          <Route path='/' render={() => {
            if (authenticated) {
              return <NavLink to={authenticated ? `/api/account/${userID}` : '/users/authenticate'}
                activeClassName={'active'}>{`user ${username}`}</NavLink>
            } else {
              return null;
            }
          }} />
        </NavBar>
        <div className='App' ref={this.appRef}>
          <Switch>
            <Route path={`/api/account/:userID`}
              render={(props) => <AccountWithRouter {...props}
                  userID={userID} getFile={this.getFile} authenticated={authenticated}/>} />

            <Route exact path='/' render={(props) => <StartScreen {...props} authenticated={authenticated}
              userID={userID} /> } />

            <Route path='/api/users/authenticate' render={() =>
              (<AuthenticateWithRouter prevPath={prevPath} authenticated={authenticated}
                isAuthenticated={this.isAuthenticated} />)} />
            
            <Route path='/api/upload-csv' render={() => (<Upload />)} />
            <Route path={`/api/datadisplay/:fileID`} render={(props) => <DataDisplay {...props} username={userID}/>} /> 
            {/* <Route path={'/api/download/:fileID/download'} component={Download} /> */}
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
