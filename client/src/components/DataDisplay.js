import React, {Component} from 'react';
import { matchPath } from 'react-router-dom';
import axios from 'axios';
import uuid from 'uuid';

import Table from './Table';
import Keyboard from './Keyboard';
import ButtonGroup from './ButtonGroup';
import ComponentEnhancer from './ComponentEnhancer';
import ConditionButtonFormatter from './ConditionButtonFormatter';
import ConditionButton from './ConditionButton';
import DumbButton from './DumbButton';
import MenuOption from './MenuOption';
import DropDownMenu from './DropDownMenu';
import Icon from './Icon';
import SelectButton from './SelectButton';
import ColumnSelector from './ColumnSelector';

// import PropTypes from 'prop-types';
import '../App.scss';

class DataDisplay extends Component {
  constructor (props) {
    super(props);
    const match = matchPath(this.props.location.pathname,{
      path: '/api/datadisplay/:id'
    });
    this.textInput = React.createRef();
    this.appRef = React.createRef();
    this.state = {
      prevPath: '',
      data: {
        header: [],
        body: [],
        description: ''
      },
      fileID: match.params.id,
      listCards: [{ // list of all the conditions cards that include conditional buttons
        cardId: 0, // id to identify each card
        field: [], // on what columns of the data the list of operations apply
        listElements: [],
        listOperations: [], // what conditions aply to the data - helps sort
      }],
      cardSelected: 0, // where conditional buttons go at one time
      keyword: '', // content of the keyword input text field
      inputVisibility: 'visible', // in the second Keyboard, whether the position input is visible
      keywordButtonClicked: '', // name of button clicked in the keyword(2nd) Keyboard
      active: [], // array of buttons active
      position: 0,
      idConditional: 0,
      menuVisible: false,
      mergerArray: [null, null, null],
    }
  }

  componentDidMount() {
    const { fileID } = this.state;
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    axios.get(`/api/datadisplay/${fileID}`, conf)
      .then(async (response) => {
        let newHeader = [];
        let newBody = [];
        response.data.header.forEach(el => newHeader.push([uuid.v4(), el]));
        response.data.body.forEach((el, index) => {
          let newRow = [];
          el.forEach(elem => newRow.push([uuid.v4(), elem]));
          newBody.push([uuid.v4(), newRow, index]);
        });
        const newData = {
          header: newHeader,
          body: newBody,
          description: response.data.description,
        };
        await this.setState({ data: newData });
        // console.log('new Data is: ', this.state.data);
      })
      .catch((err) => {
        if(err.response.status === 401) {
          console.log(`Error: ${err}`)
          this.props.history.push({pathname: '/api/users/signin',
            appState: {prevPath: this.props.location.pathname}});
          // this.setState({ windowVisible: true, goToSignIn: true, prevPath: `/api/datadisplay/${id}` });
        }
      });
  }

  regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
  }


  include (whatIsIncluded, position){
    const reg = new RegExp(this.regExpEscape(whatIsIncluded));
    return function(data){
      if (position || position === 0) {
        return data.match(reg).index === position;
      }
      return false;
    }
  }

  // startsWith (whatIsIncluded){
  //   const reg = new RegExp(this.regExpEscape(whatIsIncluded));
  //   return function(data){
  //     return reg.test(data);
  //   }
  // }

  endsWith (whatIsIncluded){
    const reg = new RegExp(this.regExpEscape(whatIsIncluded) + '$');
    return function(data){
      return reg.test(data);
    }
  }

  conjunction(fn1, fn2){
    return function(){
      return fn1() && fn2();
    }
  }
  
  disjunction(fn1, fn2){
    return function(){
      return fn1() || fn2();
    }
  }
  
  negation(fn){
    return function(){
      return !fn();
    }
  }

  fromButton = (name) => {
    const {
      keyword, keywordButtonClicked, cardSelected,
      position, listCards,
    } = this.state;
    
    let currentCard = cardSelected;
    const { listOperations } = listCards[currentCard];
    const listOperationsCopy = [...listOperations];

    // function that determines whether the keyword matches the data at the required position
    // const include = (word, posit) => (data) => {
    //   if (position || position === 0) {
    //     return data.match(new RegExp(word)).index === posit;
    //   }
    //   return data.match(new RegExp(word));
    // };

    // // function that determines whether the data string starts with the keyword
    // const endsWith = word => (data) => {
    //   const len = data.length - word.length;
    //   return include(word, len);
    // };

    // const len = currentOperation.length;
    let chldList = [];
    let lst = [];
    const listCopy = [...listCards];
    switch (name) {
      case 'SUBMIT':
        // position of the last button of a list of ConditionalButtons in a card
        // const lastConditionalButton = (card) => {
        //   return listCards[listCards.length - 1].id;
        // }

        let idCond = uuid.v4();

        if (keywordButtonClicked && keyword) {
          let conditionObj = {
            active: true,
            card: cardSelected,
            whatIsIncluded: keyword
          };
          switch (keywordButtonClicked) {
            case 'INCLUDES':
              lst = ['Includes ', keyword, ' at position ', position];
              conditionObj.position = position || 0;
              conditionObj.func = this.include(conditionObj.whatIsIncluded, conditionObj.position);
              listCopy[cardSelected].listOperations.push(conditionObj);
              break;
            case 'ENDS WITH':
              lst = ['Ends with ', keyword];
              conditionObj.func = this.endsWith(conditionObj.whatIsIncluded);
              listCopy[cardSelected].listOperations.push(conditionObj);
              break;
            case 'STARTS WITH':
              lst = ['Starts with ', keyword];
              conditionObj.func = this.include(conditionObj.whatIsIncluded, 0);
              listCopy[cardSelected].listOperations.push(conditionObj);
              break;
            default:
          }
          this.setState({ listCards: listCopy });
          chldList = lst.map((el, index) => <span key={uuid.v4()}>{`${el}`}</span>);
          // this.setState({ idConditional: idConditional + 1 });
          // adding the merged Conditional Button to the list of elements
          const propsArray = { // props passed to the ConditioButton prop
            children: chldList,
            key: idCond,
            fromConditional: this.conditionalClickHandler,
            card: cardSelected,
            id: idCond,   
          };
          const newElem = <ConditionButton {...propsArray} />;
          const copyList = [...listCards];
          copyList[cardSelected].listElements = listCards[cardSelected].listElements
            .concat(newElem);
          this.setState({ listCards: copyList });
          // this.updateHistory();
        }

        break;
      case 'INCLUDES':
        this.setState({ keywordButtonClicked: name, inputVisibility: 'visible' });

        break;
      case 'ENDS WITH':
        this.setState({ keywordButtonClicked: name });
        break;
      case 'STARTS WITH':
        this.setState({ keywordButtonClicked: name });
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

  textHandler = (e) => {
    this.setState({ keyword: e.target.value });
  };

  positionHandler = (e) => {
    this.setState({ position: e.target.value });
  }

  // handles clicks on conditional buttons; helps combine conditions
  conditionalClickHandler = async (conditionalButtonId, clickTop, clickLeft, card) => {
    const { mergerArray, cardSelected, menuVisible } = this.state;
    const appTop = this.appRef.current.offsetTop;
    const appLeft = this.appRef.current.offsetLeft;
    if (cardSelected === card) {
      if (mergerArray[0] === null) {
        console.log('menuvisible to be true');
        await this.setState({
          mergerArray: [conditionalButtonId, null, null],
          menuVisible: true,
          menuTop: clickTop - appTop - 10,
          menuLeft: clickLeft - appLeft - 15,
        });
        console.log('first');
      } else if (mergerArray[1] === null && mergerArray[0] === conditionalButtonId && menuVisible === false){
        this.setState({ menuVisible: true });
      } else if (mergerArray[1] === null && mergerArray[0] !== conditionalButtonId) {
        await this.setState({ mergerArray: [conditionalButtonId, null, null] });
      } else if (mergerArray[1] !== null && mergerArray[0] !== conditionalButtonId) {
        this.merger(mergerArray[0], mergerArray[1], conditionalButtonId);
        await this.setState({ mergerArray: [null, null, null] });
      }
    }
    console.log(this.state.mergerArray);
  };

  // modifies the visibility of the menu that helps merge conditional buttons
  menuHide = () => this.setState({ menuVisible: false });

  selectCard = (card) => {
    this.setState({ cardSelected: card });
  }

  // handles clicks on the menu - calls merger to merge conditional buttons
  menuClickHandler = (name) => {
    const { mergerArray } = this.state;
    this.setState({ menuVisible: false });
    if (mergerArray[0] !== null) {
      let mer = [...mergerArray];
      mer[1] = name;
      if (name === 'NOT') {
        this.merger(mergerArray[0], 'NOT', null);
      } else {
        this.setState({ mergerArray: mer });
      }
    }
}

  merger = (...arr) => {
    const { listCards, cardSelected } = this.state;
    console.log('arr arguments: ', arr);

    // merges two conditional buttons into a combined new conditional button
    const newElement = (element1, name, element2) => {
      console.log('elem1: ', element1);
      console.log('elem2: ', element2);
      const newProps = {};
      const newId = uuid.v4();
      newProps.id = newId;
      newProps.key = newId;
      newProps.card = cardSelected;
      return (
        <ConditionButton {...newProps} fromConditional={this.conditionalClickHandler}>
          {element2}
          <div>{name}</div>
          {element1}
        </ConditionButton>
      );
    };

    // searches for the element that has a certain id
    const searcher = (id) => {
      for (let i = 0; i < listCards[cardSelected].listElements.length; i++) {
        if (listCards[cardSelected].listElements[i].props.id === id) { return i; }
      }
      return -1;
    };
    // const splicer = (arr, index1, index2) => {
    //   arr.splice(Math.max(index1, index2), 1);
    //   arr.splice(Math.min(index1, index2), 1);
    // };
    const copyListElements = [...listCards[cardSelected].listElements];
    console.log('copyListElements: ', copyListElements);
    const copyListCards = [...listCards];
    const index1 = arr[0] ? searcher(arr[0]) : null;
    const index2 = arr[2] ? searcher(arr[2]) : null;
    console.log('index1: ', index1);
    console.log('index2: ', index2);
    console.log('elem1: ',  copyListElements[index1]);
    copyListElements.push(newElement(
      copyListElements[index1],
      arr[1],
      (index2 === null) ? null : copyListElements[index2]
    ));
    // const x = copy.splice(searcher(arr[0]), 1);
    if (arr[2] === null && arr[1] === 'NOT') {
      // copyListCards[cardSelected].listElements = copyListElements.concat(newElement(...arr.reverse()));
      copyListElements.splice(index1, 1);
    } else {
      // const y = copy.splice(searcher(arr[2]));
      // copyListCards[cardSelected].listElements = copyListElements.concat(newElement(y, arr[1], x));
      copyListElements.splice(Math.max(index1, index2), 1);
      copyListElements.splice(Math.min(index1, index2), 1);
    }
    copyListCards[cardSelected].listElements = copyListElements;

    this.setState({ listCards: copyListCards });
    // this.updateHistory();
  }

  filterExecuted = () => {
    const {listCards, cardSelected} = this.state;
    const {listOperations} = this.state.listCards[this.state.cardSelected];
    for (let i = listOperations.length - 1; i>= 0; i--) {
      if (listOperations[i].active){

      }
    }
  }

  // handles clicks on the two icons (+ or -) - adds or deletes cards
  iconClicked = (type, keyboardNo) => {
    const { listCards } = this.state;
    if (type === '+') {
      this.setState({
        listCards: listCards.concat({
          cardId: listCards.length,
          listElements: [],
          listOperations: [],
        }),
      });
    } else if (type === '-' && listCards.length > 1) {
      const copy = [...listCards];
      copy.splice(keyboardNo, 1);
      this.setState({ listCards: copy });
    }
  }

  columnSelector = (e) => {
    let columnString = e.target.value;
    let columnArray = columnString.split(',');
    let reducer = columnArray.reduce((acc, el) => {
      if (/\d+/.test(el.trim())){
        return acc.concat(parseInt(el, 10));
      } else if (/\d+-\d+/.test(el.trim())){
        let arr = el.split('-');
        let min = Math.min(parseInt(arr[0], 10), parseInt(arr[1], 10));
        let max = Math.max(parseInt(arr[0], 10), parseInt(arr[1], 10));
        let result = Array.from(new Array(max - min + 1), (x, i) => i + min);
        return acc.concat(result);
      }
      return acc;
    }, []);
    let copy = [...this.state.listCards];
    let copySelectedColumns = [...copy[this.state.cardSelected]];

    this.setState({ });
  }

  render() {
    const {data, inputVisibility, active, listCards, cardSelected, menuVisible,
      menuTop, menuLeft,
      } = this.state;
    // const {
      // inputVisibility, menuVisible, active, listCards, menuTop, menuLeft, cardSelected,
      // data, windowVisible, uploaded, uploadedID, userID, username, uploadSuccesful, displayData,
      // accountView, accountData, startScreenDisplay, optionChosen, authenticated, anonymous,
      // goToSignIn, goHome, goUpload, fileID, goToDisplay
      // authenticated, userID, username
    // } = this.state;
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
      <div className='dataDisplay'>
        {/* -------------------------------main application----------------------------------------------- */}
        <div className='App' ref={this.appRef}>
          { /* includes description and operator buttons */ }
          <Keyboard leftSection='Boolean operators' classProp=''>
            <ButtonWithHandler name='AND' />
            <ButtonWithHandler name='OR' />
            <ButtonWithHandler name='NOT' />
          </Keyboard>
          {/* the card that constructs conditional buttons */}
          <Keyboard
            leftSection='Search keyword' classProp=' keyboardSearchKeyword'
            icon='' typeContent=''
            id={0} cardSelected={0}
          >
            <div className='centerKeyboard'>
              <ButtonGroup>
                <ButtonWithHandler name='INCLUDES' />
                <ButtonWithHandler name='STARTS WITH' />
                <ButtonWithHandler name='ENDS WITH' />
              </ButtonGroup>
              <div className='centerBottomKeyboard'>
                <input // the keyword used to search
                  type='text' onChange={this.textHandler}
                  placeholder='Type keyword' ref={this.textInput}
                />
                <div className={inputVisibility}><div>in position</div></div>
                <input // by default, any match would satisfy condition, regardless of position
                  type='text' className={`positionInput ${inputVisibility}`}
                  onChange={this.positionHandler}
                />
              </div>
            </div>
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
                <input type='text' placeholder='Input column numbers' onChange={this.columnSelector}></input>
                <button type='button' onClick={this.columnSelectorSubmit}>Submit</button>
              </div>
            );
            return (
              <Keyboard
                key={el.cardId} leftSection={typeContent}
                classProp='' rightSection={iconsElements}
                cardSelected={cardSelected} id={el.id}
              >
                <ConditionButtonFormatter fromFormatter={this.fromFormat}>
                  {el.listElements.map(elem => elem)}
                </ConditionButtonFormatter>
              </Keyboard>
            );
          })}
          <div>
            <button onClick={this.filterExecuted}>Filter</button>
          </div>
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

        <h3>{data.description}</h3>
        <div className='scrollTable'>
          <Table data={data} fromSortButton={this.fromSortButton}
            sorter={this.sorter} />
        </div>
        {/* <Route render={() => (
          (prevPath !== '/upload-csv') ? <Table data={data}/> : <Redirect to='/' />
        )} /> */}
      </div>
    );
  }
}

// DataDisplay.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default DataDisplay;
