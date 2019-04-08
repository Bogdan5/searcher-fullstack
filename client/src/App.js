import React, { Component } from 'react';
import axios from 'axios';
import { Switch, NavLink, Route, Redirect } from 'react-router-dom';

import Keyboard from './components/Keyboard';
import ButtonGroup from './components/ButtonGroup';
import DataDisplay from './components/DataDisplay';
import DumbButton from './components/DumbButton';
import Header from './components/Header';
import Sorter from './components/Sorter';
import ComponentEnhancer from './components/ComponentEnhancer';
import ConditionButtonFormatter from './components/ConditionButtonFormatter';
import ConditionButton from './components/ConditionButton';
import DropDownMenu from './components/DropDownMenu';
import MenuOption from './components/MenuOption';
import Icon from './components/Icon';
import SelectButton from './components/SelectButton';
import ColumnSelector from './components/ColumnSelector';
import UploadWindow from './components/UploadWindow';
import NavBar from './components/NavBar';
import ComponentChildAdder from './components/ComponentChildAdder';
import Register from './components/Register.js';
import SignIn from './components/SignIn.js';
import SortButton from './components/SortButton';
import BackgroundPopWindow from './components/BackgroundPopWindow';
import Upload from './components/Upload';
import Account from './components/Account';
import StartScreen from './components/StartScreen';

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
      data: [],
      windowVisible: true,
      windowKind: 'upload',
      email: '',
      registered: false,
      signedIn: false,
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
    };
  }

  componentDidMount() {
    console.log('component did mount');
    this.textInput.current.focus();

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    axios.get('/test', conf)
      .then(async (res) => {
        console.log('test res is: ', res);
        await this.setState({ authenticated: true, username: res.data.username, userID: res.data._id });
        console.log('username: ', this.state.username);
        })
      .catch(err => console.log('Error:', err));
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
      this.setState({ windowVisible: false });
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

  // called when 'Sign up' is clicked in Register component
  registered = () => {
    this.setState({ registered: true, signedIn: true, windowVisible: false });
  }

  // called when 'Sign in' is clicked in SignIn component
  signedIn = (username, userID) => {
    console.log('signedIn props fired');
    this.setState({ signedIn: true, userID, username, windowVisible: false });
  }

  uploaded = (data) => {
    let {header, body} = data;

    this.setState({ uploadedData: data });
  }

  // after click on 'Sign in' button in the Navbar opens the 
  openSignInNav = () => {
    this.setState({ uploaded: false, windowVisible: true });
  }

  openSignUpNav = () => {
    this.setState({ uploaded: false, windowVisible: true });
  }

  accountView = () => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer },
      userID: this.state.userID,
    };
    axios.get(`/api/account/${this.state.userID}`, conf)
      .then((response) => {
        this.setState({ accountView: true, accountData: response.data.accountData });
        console.log('Response for get account: ', response);
      })
      .catch((err) => console.log(`Error: ${err}`));
  }

  accountExit = () => {
    this.setState({ accountView: false, windowVisible: false });
  }

  optChosen = (option) => {
    this.setState({ optionChosen: option, startScreenDisplay: false })
  }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////RENDER////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   render() {
    const {
      inputVisibility, menuVisible, active, listCards, menuTop, menuLeft, cardSelected,
      data, windowVisible, registered, uploaded, signedIn, uploadedID, userID, username,
      accountView, accountData, startScreenDisplay, optionChosen
    } = this.state;
    // enhancing DumbButtons to ButtonWithHandler through ComponentEnhancer
    const propertiesObj = { // properties object passed to ComponentEnhancer
      fromButton: this.fromButton, // a handler is added to buttons in order to pass data
      // from DumbButton chid to the App parent
      active, // in element buttons, true greyed out
      keywordButtonClicked: this.state, // what element button is clicked
    };
    const ButtonWithHandler = ComponentEnhancer(DumbButton, propertiesObj);
    // adds a click handler to all components of the DropDownMenu
    const propertiesMenu = { fromMenu: this.menuClickHandler };
    const MenuElementWithHandler = ComponentEnhancer(MenuOption, propertiesMenu);

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
        {/* -------------------------------------------NAVBAR----------------------------------------------- */}
        {/* navigation bar with upload, sign up, and sign in buttons */}
        <NavBar>
          <NavLink to='/api/upload-csv' onClick={this.uploadUnsigned}>Upload file without signing in</NavLink>
          <NavLink to='/api/upload-csv' onClick={this.uploadSigned}>Upload file</NavLink>
          <NavLink to='/api/users/signin' onClick={this.openSignInNav}>Sign in</NavLink>
          <NavLink to='/api/users/signup' onClick={this.openSignUpNav}>Sign up</NavLink>
          <Route path='/' render={() => {
            if (signedIn) {
              return (<NavLink to={`/api/account/${userID}`} onClick={this.accountView}>
                        {username}
                      </NavLink>)
            } else {
              return null;
            }
          }} />
          {/* <button onClick={this.openUploadWindow}>Upload files</button>
          <button onClick={this.openUploadWindow}>Upload files</button> */}
        </NavBar>

        {/* -------------------------------main application----------------------------------------------- */}
        <div className='App' ref={this.appRef}>
          {/* the header with the description on the app */}
          <Header title='Data display - Search and sort' />
          { /* includes description and operator buttons */ }
          {/* <Keyboard leftSection='Boolean operators' classProp=''>
            <ButtonWithHandler name='AND' />
            <ButtonWithHandler name='OR' />
            <ButtonWithHandler name='NOT' />
          </Keyboard> */}
          {/* the card that constructs conditional buttons */}
          <Keyboard
            leftSection='Search keyword' classProp=' keyboardSearchKeyword'
            icon='' typeContent=''
            id={0} cardSelected={0}
          >
            <ButtonGroup>
              <ButtonWithHandler name='INCLUDES' />
              <ButtonWithHandler name='STARTS WITH' />
              <ButtonWithHandler name='ENDS WITH' />
            </ButtonGroup>
            <input // the keyword used to search
              type='text' onChange={this.textHandler}
              placeholder='Type keyword' ref={this.textInput}
            />
            <div className={inputVisibility}>in position</div>
            <input // by default, any match would satisfy condition, regardless of position
              type='text' className={`positionInput ${inputVisibility}`}
              onChange={this.positionHandler}
            />
            <ButtonWithHandler name='SUBMIT' visibility={inputVisibility} />
            <ButtonWithHandler name='CANCEL' />
          </Keyboard>
          {/* an array of cards with the result of Keyword input - includes the
          search structure based on which the uploaded data will be sorted and displayed*/}
          {listCards.map((el, index) => {
            // this variable determines the kinds of icons are placed on the right of these cards
            // if the card is the last one, only the '-' one, two ('+' and '-') for the rest
            const iconsArray = (listCards.length === index + 1) ? ['+', '-'] : ['-'];
            // this function adds each button to the left of each card based on the array in iconsArray
            const iconsElements = (
              <div>
                {iconsArray.map((item, ind) => {
                  const ident = `${el.id}-${ind}`;
                  return (
                    <Icon
                      type={item} fromIcon={this.iconClicked}
                      keyboardNo={el.id} key={ident}
                    />
                  );
                })}
              </div>
            );
            // the left component of the card - determines whether card used or what columns are displayed
            const typeContent = (
              <div>
                <SelectButton card={el.id} fromSelect={this.selectCard}>Select</SelectButton>
                <br />
                <ColumnSelector
                  className='selector' onChange={this.setColumnSelect}
                  card={el.id}
                >
                  <option value='colAll'>Selects fields</option>
                  <option value='colAll'>All fields</option>
                  <option value='col1'>Column 1</option>
                  <option value='col2'>Column 2</option>
                  <option value='col3'>Column 3</option>
                </ColumnSelector>
              </div>
            );
            return (
              <Keyboard
                key={el.id} leftSection={typeContent}
                classProp='' rightSection={iconsElements}
                cardSelected={cardSelected} id={el.id}
              >
                <ConditionButtonFormatter fromFormatter={this.fromFormat}>
                  {el.listElements.map((elem) => {
                    // extends the functionality of the element with 
                    const copy = React.cloneElement(elem, { card: el.id });
                    return copy;
                  })}
                </ConditionButtonFormatter>
              </Keyboard>
            );
          })}
          {/* buttons for sorting the data */}
          <Route path='/api/datadisplay' render={() => (<DataDisplay uploadedID={uploadedID} />)} />

          {/* data displayed as resulted from search and sort operations ------------------------------------*/}
          <DropDownMenu
            menuVisible={menuVisible} mouseOutMenu={this.menuHide}
            style={{ top: menuTop, left: menuLeft }}
          >
            <MenuElementWithHandler name='NOT' />
            <MenuElementWithHandler name='AND' />
            <MenuElementWithHandler name='OR' />
            <MenuElementWithHandler name='DELETE' />
          </DropDownMenu>
        </div>
        {/* The modal that contains the registration, signin, and file upload ------------------------------ */}
        <BackgroundPopWindow classInput={windowVisible}>
          <UploadWindow classInput={windowVisible}>
            <div className='popHeader'>
              <NavLink to='/' onClick={this.closeUploadWindow} >X</NavLink>
            </div>
            <Switch>
              <Route path='/api/users/signup' render={() => (registered ?
                <Redirect to='/' /> : <Register registered={this.registered} />)} />
              <Route path='/api/users/signin' render={() => (signedIn ?
                <Redirect to='/' /> : <SignIn signedIn={this.signedIn} />)} />
              <Route path='/api/upload-csv' render={() => (uploaded ?
                <Redirect to={`/api/datadisplay/${uploadedID}`} /> : 
                <Upload uploaded={this.uploaded} />)} />
              <Route path={`/api/account/${userID}`} render={() => (accountView ?
                <Account username={username} userID={userID}
                accountExit={this.accountExit} accountData={accountData} /> : <Redirect to='/' />
              )} />
              {/* <Route path='/' render={() => {
                if (startScreenDisplay) {
                  <StartScreen optChosen={this.optChosen} />
                } else {
                  switch (optionChosen) {
                    case 'with':

                  }
                }
              }
              
              (startScreenDisplay ? 
                <StartScreen optChosen={this.optChosen} /> : ((optionChosen === 'with') ?
                <Redirect to='/api/users/signin' /> : <Redirect to='/api/upload-csv' />))
              } /> */}
            </Switch>
          </UploadWindow>
        </BackgroundPopWindow>
      </div>
    );
  }
}

export default App;
