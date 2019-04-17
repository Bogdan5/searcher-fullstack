import React, { Component } from 'react';
import axios from 'axios';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
// import uuid from "uuid";


import DataDisplay from './components/DataDisplay';
// import Header from './components/Header';
// import Sorter from './components/Sorter';
import ConditionButton from './components/ConditionButton';

// import UploadWindow from './components/UploadWindow';
import NavBar from './components/NavBar';
// import ComponentChildAdder from './components/ComponentChildAdder';
// import Register from './components/Register.js';
import SignIn from './components/SignIn.js';
// import SortButton from './components/SortButton';
// import BackgroundPopWindow from './components/BackgroundPopWindow';
import Upload from './components/Upload';
import Account from './components/Account';
import StartScreen from './components/StartScreen';
// import SignOptions from './components/SignOptions';
// import UploadSuccess from './components/UploadSuccess';

import './App.css';


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
      windowVisible: true,
      windowKind: 'upload',
      email: '',
      uploaded: false,
      uploadedID: null,
      uploadedData: {},
      userID: null,
      username: '',
      accountView: false,
      accountData: null,
      startScreenDisplay: true,
      optionChosen: 'without',
      authenticated: false,
      anonymous: true,
      uploadedSuccesful: false,
      displayData: false,
      goToSignIn: false,
      prevPath: null,
      goHome: false,
      goUpload: false,
      fileID: '',
      goToDisplay: false,
    };
  }

  componentDidMount() {
    // this.textInput.current.focus();

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    axios.get('/test', conf)
      .then(async (res) => {
        // console.log('userid: ', res.data._id);
        await this.setState({ authenticated: true, username: res.data.username, userID: res.data._id });
        })
      .catch(err => console.log('Error:', err.response.status));
  }

  textHandler = (e) => {
    this.setState({ keyword: e.target.value });
  };

  positionHandler = (e) => {
    this.setState({ position: e.target.value });
  }

   // modifies the visibility of the menu that helps merge conditional buttons
   menuHide = () => this.setState({ menuVisible: false });

   selectCard = (card) => {
     // console.log('card selected' + card);
     this.setState({ cardSelected: card });
   }
 
   searchObject = (obj, searchPropName, searchProp, targetProp) => {
     let result = null;
     Object.keys(obj).forEach((el) => {
       if (el[searchPropName] === searchProp) { result = obj[targetProp]; }
     });
     return result;
   }
 
   // sets the kind of colum the condition in the respective card will apply
   setColumnSelect = (event) => {
     console.log(event.target.value);
   }
 
   // updateHistory = () => {
   //   const { historyElements, historyOperations, listElements, listOperations } = this.state;
   //   this.setState({
   //     historyElements: historyElements.concat(listElements),
   //     historyOperations: historyOperations.concat(listOperations),
   //   });
   // }
 
   // merges two conditional buttons in a larger conditional button
   merger = (...arr) => {
     const { listCards, idConditional, cardSelected } = this.state;
     const newElement = (element1, name, element2) => {
       const newProps = { ...element2.props };
       newProps.id = idConditional + 1;
       newProps.key = idConditional + 1;
       return (
         <ConditionButton {...newProps} fromConditional={this.conditionalClickHandler}>
           {element1}
           <div>{name}</div>
           {element2}
         </ConditionButton>
       );
     };
     const searcher = (id) => {
       for (let i; i < listCards[cardSelected].listElements.length; i++) {
         if (listCards[cardSelected].listElements[i] === id) { return i; }
       }
       return -1;
     };
     const copy = [...listCards[cardSelected].listElements];
     const copyList = [...listCards];
     const x = copy.splice(searcher(arr[0]), 1);
     if (arr.length === 2 && arr[1] === 'NOT') {
       // console.log('x props' + JSON.stringify(x));
       copyList[cardSelected].listElements = copy.concat(newElement(null, arr[1], x));
     } else if (arr.length === 3) {
       const y = copy.splice(searcher(arr[2]));
       copyList[cardSelected].listElements = copy.concat(newElement(y, arr[1], x));
     }
     this.setState({ listCards: copyList });
     // this.updateHistory();
   }
 
   // handles clicks on conditional buttons; helps combine conditions
   conditionalClickHandler = (id, clickTop, clickLeft, card) => {
     // console.log('conditional clicked in App button' + clickTop + ' ' + clickLeft);
     // console.log('formatter offset top' + this.formatterConditionButton.current.offsetTop);
     const { mergerArray, cardSelected } = this.state;
     const appTop = this.appRef.current.offsetTop;
     const appLeft = this.appRef.current.offsetLeft;
     // console.log('app offsets' + appTop + ' ' + appLeft);
     if (cardSelected === card) {
       if (mergerArray[0] === null) {
         this.setState({
           mergerArray: [id, null, null],
           menuVisible: true,
           menuTop: clickTop - appTop - 10,
           menuLeft: clickLeft - appLeft - 15,
         });
       } else if (mergerArray[1] === null && mergerArray[0] !== id) {
         this.setState({ mergerArray: [id, null, null] });
       } else if (mergerArray[1] !== null && mergerArray[0] !== id) {
         this.merger(mergerArray[0], mergerArray[1], id);
         this.setState({ mergerArray: [null, null, null] });
       }
     }
   };
 
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
 
   // function that passes data from DumbButton
   fromButton = (name) => {
     const {
       keyword, keywordButtonClicked, cardSelected,
       position, idConditional, listCards,
     } = this.state;
    //  const { listOperations } = listCards[cardSelected];
 
     // function that determines whether the keyword matches the data at the required position
     const include = (word, posit) => (data) => {
       if (position || position === 0) {
         return data.match(new RegExp(word)).index === posit;
       }
       return data.match(new RegExp(word));
     };
 
     // function that determines whether the data string starts with the keyword
     const endsWith = word => (data) => {
       const len = data.length - word.length;
       return include(word, len);
     };
 
     this.setState({ keywordButtonClicked: name });
     if (name === 'INCLUDES') { this.setState({ inputVisibility: 'visible' }); }
     // const len = currentOperation.length;
     let chldList = [];
     let lst = [];
     const listCopy = [...listCards];
     switch (name) {
       case 'SUBMIT':
         if (keywordButtonClicked && keyword) {
           switch (keywordButtonClicked) {
             case 'INCLUDES':
               lst = ['Includes ', keyword, ' at position ', position];
               listCopy[cardSelected].listOperations.push(include(keyword, position));
               break;
             case 'ENDS WITH':
               lst = ['Ends with ', keyword];
               listCopy[cardSelected].listOperations.push(endsWith(keyword));
               break;
             case 'STARTS WITH':
               lst = ['Starts with ', keyword];
               listCopy[cardSelected].listOperations.push(include(keyword));
               break;
             default:
           }
           this.setState({ listCards: listCopy });
           chldList = lst.map((el, index) => <span key={index}>{`${el}`}</span>);
           this.setState({ idConditional: idConditional + 1 });
           const propsArray = { // props passed to the ConditioButton prop
             children: chldList,
             key: idConditional,
             fromConditional: this.conditionalClickHandler,
             id: idConditional,
           };
           const newElem = <ConditionButton {...propsArray} />;
           const copyList = [...listCards];
           copyList[cardSelected].listElements = listCards[cardSelected].listElements
             .concat(newElem);
           this.setState(
             {
               listCards: copyList,
               idConditional: idConditional + 1,
             },
           );
           // this.updateHistory();
         }
 
         break;
       case 'CANCEL':
         this.setState({ currentOperation: [] });
         break;
       case 'Sign up':
         this.setState({ windowKind: 'Sign up'});
         break;
       case 'Sign in':
        this.setState({ windowKind: 'Sign in'});
        break;
       case 'Upload file':
         this.setState({ windowKind: 'Upload file'});
         break;
       default:

       if (this.state.windowVisible) {
         this.openWindow();
       }
     }
   };
 
   // handles clicks on the two icons (+ or -) - adds or deletes cards
   iconClicked = (type, keyboardNo) => {
     const { listCards } = this.state;
     if (type === '+') {
       this.setState({
         listCards: listCards.concat({
           id: listCards.length,
           listElements: [],
           listOperations: [],
         }),
       });
     } else if (type === '-' && listCards.length > 1) {
       // console.log('deleted card ' + keyboardNo);
       const copy = [...listCards];
       copy.splice(keyboardNo, 1);
       this.setState({ listCards: copy });
     }
   }

  openUploadWindow = () => {
    this.setState({ windowVisible: true });
  }

  closeUploadWindow = () => {
    this.setState({ windowVisible: false, uploadSuccesful: false,
      accountView: false, goHome: true, goUpload: false });
  }

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

  uploadClickedNav = () => {
    this.setState({ uploaded: false });
    this.openUploadWindow();
  }

  uploadSigned = () => {
    this.setState({ windowVisible: true, goUpload: true, goHome: false, displayData: false });
  }

  // called when 'Sign up' is clicked in Register component
  registered = () => {
    this.setState({ authenticated: true, windowVisible: false });
  }

  // called when 'Sign in' is clicked in SignIn component
  signedIn = (username, userID) => {
    this.setState({ authenticated: true, userID, username, windowVisible: false, goToSignIn: false,
      prevPath: null });
  }

  uploadCall = (id) => {
    console.log('uploadSuccesfulCall - id: ', id);
    this.setState({ uploadedID: id, uploadSuccesful: true });
  }

  // after click on 'Sign in' button in the Navbar opens the 
  openSignInNav = () => {
    this.setState({ uploaded: false, windowVisible: true, goHome: false });
  }

  openSignUpNav = () => {
    this.setState({ uploaded: false, windowVisible: true, goHome: false });
  }

  // viewAccount = () => {
  //   const bearer = 'Bearer ' + localStorage.getItem('token');
  //   const conf = {
  //     headers: { 'Authorization': bearer },
  //     userID: this.state.userID,
  //   };
  //   axios.get(`/api/account/${this.state.userID}`, conf)
  //     .then((response) => {
  //       console.log('account get response: ', response.data);
  //       this.setState({accountData: response.data, accountView: true, windowVisible: true, displayData: false,
  //         goHome: false, goToSignIn: false });
  //     })
  //     .catch((err) => {
  //       console.log('err', typeof err.response.status);
  //       if(err.response.status === 401) {
  //         console.log('401 called')
  //         this.setState({ windowVisible: true, goToSignIn: true, prevPath: '/api/account' });
  //       }
  //     });
  // }

  accountExit = () => {
    this.setState({ accountView: false, windowVisible: false, goHome: true, goUpload: false });
  }

  getAccountFile = (id) => {

  }

  optChosen = (option) => {
    switch(option){
      case 'uploadAnon':
        this.setState({anonymous: true});
        break;
      case 'uploadSign':
        this.setState({anonymous: false});
        break;
      case 'account':
        console.log('before viewAccount fired');
        this.viewAccount();
        break;
      default:
    }

    this.setState({ optionChosen: option, startScreenDisplay: false })
  }

  getFile = (fileID) => {
    console.log('getFile in App');
    this.setState({ fileID, windowVisible: false, goToDisplay: true });
  }

  // getUploadedData = (id = this.state.uploadedID) => {
  //   console.log('get uploaded data fired - id: ', id);
  //   const bearer = 'Bearer ' + localStorage.getItem('token');
  //   const conf = {
  //     headers: { 'Authorization': bearer }
  //   };
  //   axios.get(`/api/datadisplay/${id}`, conf)
  //     .then(async (response) => {
  //       console.log('get data start');
  //       console.log('data is: ', response);
  //       let newHeader = [];
  //       let newBody = [];
  //       response.data.header.map(el => newHeader.push([uuid.v4(), el]));
  //       response.data.body.map(el => {
  //         let newRow = [];
  //         el.map(elem => newRow.push([uuid.v4(), elem]));
  //         return newBody.push([uuid.v4(), newRow]);
  //       });
  //       const newData = {
  //         header: newHeader,
  //         body: newBody,
  //         id,
  //         description: response.data.description,
  //       };
  //       await this.setState({ data: newData, windowVisible: false, uploadedID: id,
  //         uploadSuccesful: false, displayData: true, accountView: false, goUpload: false });
  //       // console.log('new Data is: ', this.state.data);
  //     })
  //     .catch((err) => {
  //       if(err.response.status === 401) {
  //         console.log(`Error: ${err}`)
  //         this.setState({ windowVisible: true, goToSignIn: true, prevPath: `/api/datadisplay/${id}` });
  //       }
  //     });
      // this.setState({ uploadSuccesful: false });

  // }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////RENDER////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const {
      // inputVisibility, menuVisible, active, listCards, menuTop, menuLeft, cardSelected,
      // data, windowVisible, uploaded, uploadedID, userID, username, uploadSuccesful, displayData,
      // accountView, accountData, startScreenDisplay, optionChosen, authenticated, anonymous,
      // goToSignIn, goHome, goUpload, fileID, goToDisplay
      authenticated, userID, username
    } = this.state;
    // enhancing DumbButtons to ButtonWithHandler through ComponentEnhancer
    // const propertiesObj = { // properties object passed to ComponentEnhancer
    //   fromButton: this.fromButton, // a handler is added to buttons in order to pass data
    //   // from DumbButton chid to the App parent
    //   active, // in element buttons, true greyed out
    //   keywordButtonClicked: this.state, // what element button is clicked
    // };
    // const ButtonWithHandler = ComponentEnhancer(DumbButton, propertiesObj);
    // adds a click handler to all components of the DropDownMenu
    // const propertiesMenu = { fromMenu: this.menuClickHandler };
    // const MenuElementWithHandler = ComponentEnhancer(MenuOption, propertiesMenu);

    // adds handler to the navbar buttons
    // const navbarProps = { fromButton: this.navbarClickHandler };
    // const NavbarButtons = ComponentEnhancer(DumbButton, navbarProps);

    // adds a closing button to all the pop-up windows (upload, signup, and signin)
    // const closingButton = (
    //   <div className='popHeader'>
    //     <div onClick={this.closeUploadWindow}>X</div>
    //   </div>
    // );
    // const PopupWindowEnhanced = ComponentChildAdder(UploadWindow, closingButton, 0);

    return (
      <div className='bodyContainer'>
{/* -------------------------------------navbar---------------------------------------------------- */}

        <NavBar>
          <NavLink to='/api/upload-csv' >Upload file without signing in</NavLink>
          <NavLink to={authenticated ? '/api/upload-csv' : '/api/users/signOptions'}>Upload file</NavLink>
          <Route render={() => (authenticated ? null :
            <NavLink to='/api/users/signin' >Sign in</NavLink>) } />
          <Route render={() => (authenticated ? null :
            <NavLink to='/api/users/signup' >Sign up</NavLink>)} />         
          <Route path='/' render={() => {
            if (authenticated) {
              return <NavLink to={`/api/account/${userID}`} >{username}</NavLink>
            } else {
              return null;
            }
          }} />
        </NavBar>

        <div className='App' ref={this.appRef}>
          <Switch>
            <Route path={`/api/account/:userID`} render={(props) => <Account {...props}
                  userID={userID} getFile={this.getFile}/>} />
            <Route path={`/api/datadisplay/:fileID`}
              component={DataDisplay} />

            <Route exact path='/' render={(props) => <StartScreen {...props} authenticated={authenticated}
              userID={userID} /> } />

            <Route path='/api/users/signin' render={() => (authenticated ?
                <Redirect to='/' /> : <SignIn />)} />
            
            <Route path='/api/upload-csv' component={Upload} />
          </Switch>
        </div>        
      </div>
    );
  }
}

export default App;
