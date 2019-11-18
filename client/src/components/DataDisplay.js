import axios from 'axios';
import React, { Component } from 'react';
import { matchPath } from 'react-router-dom';
import uuid from 'uuid';
// import PropTypes from 'prop-types';
import '../App.scss';
import ButtonGroup from './ButtonGroup';
import ComponentEnhancer from './ComponentEnhancer';
import ConditionButton from './ConditionButton';
import ConditionButtonFormatter from './ConditionButtonFormatter';
import DropDownMenu from './DropDownMenu';
import DumbButton from './DumbButton';
import Icon from './Icon';
import Keyboard from './Keyboard';
import MenuOption from './MenuOption';
import SelectButton from './SelectButton';
import Table from './Table';
import DataKeyAdder from './DataKeyAdder';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class DataDisplay extends Component {
  constructor (props) {
    super(props);
    const match = matchPath(this.props.location.pathname,{
      path: '/api/datadisplay/:id'
    });
    const firstCard = uuid.v4();
    this.textInput = React.createRef(); // ref used to autofocus the keyword input
    this.appRef = React.createRef(); // ref used to measure the position of the App div
    this.state = {
      prevPath: '',
      data: {
        header: [], // header of the csv data file
        body: [], // data of the csv data file
        description: '', // string describing each file
        columnTypes: [],
      },
      fileID: match.params.id,
      listCards: [{ // list of all the conditions cards that include conditional buttons
        cardId: firstCard, // id to identify each card
        field: [], // on what columns of the data the list of operations apply
        listOperations: [], // what conditions aply to the data - helps sort
        listElements: [], // the list of conditional elements
        immediateChildren: [],
      }],
      cardSelected: firstCard, // where conditional buttons go at one time
      currentCardIndex: 0, // on the array of cards what position is the current card
      keyword: '', // content of the keyword input text field
      number: null,
      inputVisibility: 'visible', // in the second Keyboard, whether the position input is visible
      keywordButtonClicked: '', // name of button clicked in the keyword(2nd) Keyboard
      numberButtonClicked: '',
      active: [], // array of buttons active
      position: 0,
      idConditional: 0,
      menuVisible: false, // true if the menu is visible when a conditional button is clicked
      mergerArray: [null, null, null], // the array composed of 2 conditional buttons and an operation
      filtering: false, // true if filtering is taking place
      conditionalButtonClicked: null,
      conditionalButtonChanges: 0,
      keyboardVisibilityToggle: '',
    }
  }

  componentDidMount() {
    const { fileID } = this.state;
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    // retrieves data from csv files uploaded in the database
    axios.get(`/api/datadisplay/${fileID}`, conf)
      .then((response) => {
        console.log('new Data is: ', response.data);
        this.setState({ data: DataKeyAdder(response.data) });
      })
      .catch((err) => {
        console.log('Error ', err)
        if(err.response.status === 401) {
          console.log(`Error: ${err}`)
          this.props.history.push({pathname: '/api/users/authenticate',
            appState: {prevPath: this.props.location.pathname}});
          // this.setState({ windowVisible: true, goToSignIn: true, prevPath: `/api/datadisplay/${id}` });
        }
      });
  }

  // escapes the special characters to be able to translate string to RegExp
  regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
  }

  // returns a function that returns true if the data checked matches a regex
  include (whatIsIncluded, position){
    const reg = new RegExp(this.regExpEscape(whatIsIncluded));
    return function(data){
      console.log('data ', data);
      if (typeof data === 'string') {
        const matcher = data.match(reg);
        if (matcher && (position || position === 0)) {
          return data.match(reg).index === position;
        }
      }
      return false;
    }
  }

  // returns a function that returns true if the data checked ends in a regex
  endsWith (whatIsIncluded){
    const reg = new RegExp(this.regExpEscape(whatIsIncluded) + '$');
    return function(data){
      return reg.test(data);
    }
  }

  greaterThan = (whatIsIncluded) => (data) => (data > whatIsIncluded);

  smallerThan = (whatIsIncluded) => (data) => (data < whatIsIncluded);

  equals = (whatIsIncluded) => (data) => {
      console.log('data is ', data, typeof data, data === whatIsIncluded);
      return data === whatIsIncluded};

  // boolean merger of two operations with AND
  conjunction(fn1, fn2){
    return function(data){
      return fn1(data) && fn2(data);
    }
  }
  
  // boolean merger of two operations with OR
  disjunction(fn1, fn2){
    return function(data){
      return fn1(data) || fn2(data);
    }
  }
  
  // boolean opposite of an operation
  negation(fn){
    return function(data){
      return !fn(data);
    }
  }

  // builds conditional elements and operations from clicking the buttons in the conditional constructor card
  fromButton = async (name, typeSubmit = null) => {
    console.log('inputs in fromButton ', name, typeSubmit);
    const {
      keyword, keywordButtonClicked, cardSelected,
      position, listCards, currentCardIndex, number, numberButtonClicked
    } = this.state;
    let keyDimension;
    let buttonClicked;
    if (typeSubmit === 'text') {
      console.log('text ');
      keyDimension = keyword;
    } else if (typeSubmit === 'number') {
      keyDimension = parseFloat(number);
      if (Number.isNaN(keyDimension)) {
        // do a message where the input is located that it is not an acceptable input
        return;
      }
    }
    let chldList = [];
    let lst = [];
    switch (name) {
      case 'SUBMIT':
        const copyListCards = [...listCards];
        // const currentCardIndex = this.cardSearcher(cardSelected);
        const copyListOperations = [...copyListCards[currentCardIndex].listOperations];
        const copyListElements = [...copyListCards[currentCardIndex].listElements];
        let idCond = uuid.v4();

        let conditionObj = {
          id: idCond,
          active: true,
          card: cardSelected,
          whatIsIncluded: keyDimension,
          immediateChildren: [],
          typeOperation: typeSubmit,
        };

        if (typeSubmit === 'text' && keywordButtonClicked) {
          switch (keywordButtonClicked) {
            case 'INCLUDES':
              lst = ['Includes ', keyDimension, ' at position ', position];
              conditionObj.position = position || 0;
              conditionObj.func = this.include(conditionObj.whatIsIncluded, conditionObj.position);
              break;
            case 'ENDS WITH':
              lst = ['Ends with ', keyDimension];
              conditionObj.func = this.endsWith(conditionObj.whatIsIncluded);
              break;
            case 'STARTS WITH':
              console.log('start with');
              lst = ['Starts with ', keyDimension];
              conditionObj.func = this.include(conditionObj.whatIsIncluded, 0);
              break;
            default:
          }
        } else if (typeSubmit === 'number' && numberButtonClicked) {
          switch (numberButtonClicked) {
            case '>':
              lst = ['Greater than ', keyDimension];
              conditionObj.func = this.greaterThan(conditionObj.whatIsIncluded);
              break;
            case '<':
              lst = ['Smaller than ', keyDimension];
              conditionObj.func = this.smallerThan(conditionObj.whatIsIncluded);
              break;
            case '>=':
              lst = ['Greater than or equal to ', keyDimension];
              conditionObj.func = this.greaterThan(conditionObj.whatIsIncluded) || this.equals(conditionObj.whatIsIncluded);
              break;
            case '=<':
              lst = ['Smaller than or equal to ', keyDimension];
              conditionObj.func = this.smallerThan(conditionObj.whatIsIncluded) || this.equals(conditionObj.whatIsIncluded);
              break;
            case '=':
              lst = ['Equal to ', keyDimension];
              conditionObj.func = this.equals(conditionObj.whatIsIncluded);
              break;
            default:
          }
        }

        // if (keywordButtonClicked && keyDimension) {
          // let conditionObj = {
          //   id: idCond,
          //   active: true,
          //   card: cardSelected,
          //   whatIsIncluded: keyDimension,
          //   immediateChildren: [],
          // };
          // switch (keywordButtonClicked) {
          //   case 'INCLUDES':
          //     lst = ['Includes ', keyDimension, ' at position ', position];
          //     conditionObj.position = position || 0;
          //     conditionObj.func = this.include(conditionObj.whatIsIncluded, conditionObj.position);
          //     break;
          //   case 'ENDS WITH':
          //     lst = ['Ends with ', keyDimension];
          //     conditionObj.func = this.endsWith(conditionObj.whatIsIncluded);
          //     break;
          //   case 'STARTS WITH':
          //     lst = ['Starts with ', keyDimension];
          //     conditionObj.func = this.include(conditionObj.whatIsIncluded, 0);
          //     break;
          //   case '>':
          //     lst = ['Greater than ', keyDimension];
          //     conditionObj.func = this.greaterThan(conditionObj.whatIsIncluded);
          //     break;
          //   case '<':
          //     lst = ['Smaller than ', keyDimension];
          //     conditionObj.func = this.smallerThan(conditionObj.whatIsIncluded);
          //     break;
          //   case '>=':
          //     lst = ['Greater than or equal to ', keyDimension];
          //     conditionObj.func = this.greaterThan(conditionObj.whatIsIncluded) || this.equals(conditionObj.whatIsIncluded);
          //     break;
          //   case '=<':
          //     lst = ['Smaller than or equal to ', keyDimension];
          //     conditionObj.func = this.smallerThan(conditionObj.whatIsIncluded) || this.equals(conditionObj.whatIsIncluded);
          //     break;
          //   case '=':
          //     lst = ['Equal to ', keyDimension];
          //     conditionObj.func = this.equals(conditionObj.whatIsIncluded);
          //     break;
            
          //   default:
          // }
          chldList = lst.map((el, index) => <span key={uuid.v4()}>{`${el}`}</span>);
          copyListOperations.push(conditionObj);
          copyListCards[currentCardIndex].listOperations = copyListOperations;
          await this.setState({ listCards: copyListCards });

          let len = this.state.listCards[currentCardIndex].listOperations.length;

          // adding the merged Conditional Button to the list of elements
          const propsArray = { // props passed to the ConditioButton prop
            children: chldList,
            fromConditional: this.conditionalClickHandler,
            card: cardSelected,
            id: idCond,
            active: true,
            condObj: this.state.listCards[currentCardIndex].listOperations[len - 1]
          };
          const newElem = <ConditionButton {...propsArray} key={idCond} />;
          copyListElements.push(newElem);
          copyListCards[currentCardIndex].listOperations = copyListOperations;
          copyListCards[currentCardIndex].listElements = copyListElements;

          this.setState({ listCards: copyListCards, filtering: false, keywordButtonClicked: '',
            conditionalButtonChanges: this.state.conditionalButtonChanges + 1 });

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
      case '>':
        this.setState({ numberButtonClicked: name });        
        break;
      case '<':
        this.setState({ numberButtonClicked: name });        
        break;
      case '>=':
        this.setState({ numberButtonClicked: name });        
        break;
      case '=<':
        this.setState({ numberButtonClicked: name });        
        break;
      case '=':
        this.setState({ numberButtonClicked: name });        
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

  // sets the keyword used in conditional operations and elements from the text input html component
  textHandler = (e) => {
    this.setState({ keyword: e.target.value });
  };

  numberHandler = (e) => {
    this.setState({ number: e.target.value });
  }

  // sets the position where the keyword is located
  positionHandler = (e) => {
    this.setState({ position: e.target.value });
  }

  // handles clicks on conditional buttons; helps combine conditions
  conditionalClickHandler = async (conditionalButtonId, clickTop, clickLeft, card) => {
    this.setState({ conditionalButtonClicked: conditionalButtonId});
    const { mergerArray, cardSelected, menuVisible } = this.state;
    const appTop = this.appRef.current.offsetTop;
    const appLeft = this.appRef.current.offsetLeft;
    if (cardSelected === card) {
      if (mergerArray[0] === null) {
        await this.setState({
          mergerArray: [conditionalButtonId, null, null],
          menuVisible: true,
          menuTop: clickTop - appTop - 10,
          menuLeft: clickLeft - appLeft - 15,
        });
      } else if (mergerArray[1] === null && mergerArray[0] === conditionalButtonId && menuVisible === false){
        this.setState({
          menuVisible: true,
          menuTop: clickTop - appTop - 10,
          menuLeft: clickLeft - appLeft - 15, });
      } else if (mergerArray[1] === null && mergerArray[0] !== conditionalButtonId) {
        await this.setState({
          mergerArray: [conditionalButtonId, null, null],
          menuVisible: true,
          menuTop: clickTop - appTop - 10,
          menuLeft: clickLeft - appLeft - 15, });
      } else if (mergerArray[1] !== null && mergerArray[0] !== conditionalButtonId) {
        this.merger(mergerArray[0], mergerArray[1], conditionalButtonId);
        await this.setState({ mergerArray: [null, null, null] });
      } else if (mergerArray[1] !== null && mergerArray[0] === conditionalButtonId) {
        this.setState({ mergerArray: [mergerArray[0], null, null],
          menuVisible: true,
          menuTop: clickTop - appTop - 10,
          menuLeft: clickLeft - appLeft - 15, });
      }
    }
  };

  // modifies the visibility of the menu that helps merge conditional buttons
  menuHide = () => this.setState({ menuVisible: false });

  // sets the current card with the select button
  selectCard = (card) => {
    this.setState({ cardSelected: card, currentCardIndex: this.cardSearcher(card) });
  }

  // handles clicks on the menu - calls merger to merge conditional buttons
  menuClickHandler = async (name) => {
    const { listCards, cardSelected, conditionalButtonClicked } = this.state;

    if (name === 'DELETE'){
      let cardListCopy;
      const index = this.buttonSearcher(conditionalButtonClicked);
      if (index > -1) {
        const inactiveChildren = this.findAllChildren(conditionalButtonClicked);
        const cardIndex = this.cardSearcher(cardSelected);
        // const buttonIndex = this.buttonSearcher(conditionalButtonClicked);
        const listOperationsCopy = listCards[cardIndex].listOperations;
        let newOperations = [];
        listOperationsCopy.forEach(el => {
          if (inactiveChildren.includes(el.id)){
            newOperations.push(Object.assign({}, el, { active: false }));
          } else {
            newOperations.push(el);
          }
        });
        const newCard = Object.assign({}, listCards[cardIndex], { listOperations: newOperations });
        let copyAllCards = [...listCards];
        copyAllCards[cardIndex] = newCard;
        this.setState({ listCards: copyAllCards,
          conditionalButtonChanges: this.state.conditionalButtonChanges + 1 });
      }
    } else {
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
  }

  //finds all children for a top level conditional button
  findAllChildren = (id) => {
    const { listCards, cardSelected } = this.state;
    const cardIndex = this.cardSearcher(cardSelected);
    const buttonList = listCards[cardIndex].listOperations;
    // const buttonIndex = this.buttonSearcher(id);
    let childrenList = [id];

    const recursiveSearcher = (ident) => {
      const buttonIndex = this.buttonSearcher(ident);
      const childrenArray = buttonList[buttonIndex].immediateChildren;
      // childrenList = childrenList.concat(childrenArray);
      if (childrenArray.length === 0) {
        return [];
      }
      if (childrenArray.length > 0) {
        childrenList.push(childrenArray[0]);
        recursiveSearcher(childrenArray[0]);
      }
      if (childrenArray.length === 2) {
        childrenList.push(childrenArray[1]);
        recursiveSearcher(childrenArray[1]);
      }
    }

    recursiveSearcher(id);
    return childrenList;
  } 

  // returns the index in the list operations of the conditional button with id
  buttonSearcher = (id) => {
    const { listCards, cardSelected } = this.state;
    const cardIndex = this.cardSearcher(cardSelected);
    for (let i = 0; i < listCards[cardIndex].listOperations.length; i++) {
      if (listCards[cardIndex].listOperations[i].id === id) { return i; }
    }
    return -1;
  };

  // returns the index of the current card
  cardSearcher = (cardId) => {
    const { listCards } = this.state;
    for (let i in listCards) {
      if (listCards[i].cardId === cardId) { return i; }
    }
    return -1;
  }

  // merges conditional buttons into a combined button through the 'and', 'or', 'not' operations
  merger = async (...arr) => {
    const { listCards, cardSelected, currentCardIndex } = this.state;
    const newId = uuid.v4();

    const index1 = this.buttonSearcher(arr[0]);
    const index2 = arr[2] ? this.buttonSearcher(arr[2]) : null;
    // const currentCardIndex = this.cardSearcher(cardSelected);

    // make copies of the list of cards to maintain immutability
    const copyListCards = [...listCards];
    const copyListOperations = [...copyListCards[currentCardIndex].listOperations];
    const copyListElements = [...copyListCards[currentCardIndex].listElements];

    // adding a new operation to the list of operations
        let newOperation = {
          id: newId,
          active: true,
          immediateChildren: arr[2] ? [arr[0], arr[2]] : [arr[0]],
        };
    switch (arr[1]){
      case 'NOT':
        newOperation.func = this.negation(copyListOperations[index1].func);
        break;
      case 'AND':
        newOperation.func = this.conjunction(copyListOperations[index1].func, copyListOperations[index2].func);
        break;
      case 'OR':
        newOperation.func = this.disjunction(copyListOperations[index1].func, copyListOperations[index2].func);
        break;
      default:
        newOperation.func = function(){}
    }

    copyListOperations.push(newOperation);

    copyListOperations[index1].active = false;
    if (arr[2]) { copyListOperations[index2].active = false }

    copyListCards[currentCardIndex].listOperations = copyListOperations;
    await this.setState({listCards: copyListCards,
      conditionalButtonChanges: this.state.conditionalButtonChanges + 1});

    let len = this.state.listCards[currentCardIndex].listOperations.length;

    // merges two conditional buttons into a combined new conditional button
    const newElement = (element1, name, element2) => {
      const newProps = {
        id: newId,
        key: newId,
        card: cardSelected,
        condObj: listCards[currentCardIndex].listOperations[len - 1],
      };
      return (
        <ConditionButton {...newProps} fromConditional={this.conditionalClickHandler}>
          {element2}
          <div>{name}</div>
          {element1}
        </ConditionButton>
      );
    };

    const newEl = newElement(
      copyListElements[index1],
      arr[1],
      (index2 === null) ? null : copyListElements[index2]
    );
    
    copyListElements.push(newEl);
    copyListCards[currentCardIndex].listElements = copyListElements;

    this.setState({ listCards: copyListCards });
    // this.updateHistory();
  }

  // handles clicks on the two icons (+ or -) - adds or deletes cards
  iconClicked = (type, keyboardNo) => {
    const { listCards } = this.state;
    if (type === '+') {
      this.setState({
        listCards: listCards.concat({
          cardId: uuid.v4(),
          listOperations: [],
          listElements: [],
          field: []
        }),
        currentCardIndex: listCards.length,
      });
    } else if (type === '-' && listCards.length > 1) {
      const copy = [...listCards];
      copy.splice(keyboardNo, 1);
      this.setState({
        listCards: copy,
        currentCardIndex: 0,
      });
    }
  }

  columnSelector = (e) => {
    const { cardSelected } = this.state;
    let columnString = e.target.value;
    let columnArray = columnString.split(',');
    let reducer = columnArray.reduce((acc, el) => {
      if (/^\d+$/.test(el.trim())){
        return acc.concat(parseInt(el, 10));
      } else if (/^\d+-\d+$/.test(el.trim())){
        let arr = el.split('-');
        let min = Math.min(parseInt(arr[0], 10), parseInt(arr[1], 10));
        let max = Math.max(parseInt(arr[0], 10), parseInt(arr[1], 10));
        let result = Array.from(new Array(max - min + 1), (x, i) => i + min);
        return acc.concat(result);
      }
      return acc;
    }, []);
    let copy = [...this.state.listCards];
    const copySelectedColumns = Object.assign({}, copy[cardSelected], {field: [...new Set(reducer)]});
    copy[cardSelected] = copySelectedColumns;
    this.setState({ listCards: copy, filtering: false });
  }

  executeFilter = () => {
    this.setState({ filtering: true, keyboardVisibilityToggle: ' keyboardInvisible' });
  }

  clear = () => {
    this.setState({ listCards: [{
      cardId: uuid.v4(),
      field: [],
      listOperations: [],
      listElements: [],
      idConditional: 0,
      menuVisible: false,
      mergerArray: [null, null, null],
      filtering: false,
      currentCardIndex: 0,
    }],
    keyboardVisibilityToggle: '',});
  }

  viewFilters = () => {
    this.setState({ keyboardVisibilityToggle: '' });
  }

  render() {
    const {data, inputVisibility, active, listCards, cardSelected, menuVisible,
      menuTop, menuLeft, filtering, conditionalButtonChanges, fileID, keyboardVisibilityToggle,
      } = this.state;  
    const { username } = this.props;

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

    // const currentCardIndex = this.cardSearcher(cardSelected);

    return (
      <div className='dataDisplay'>
        {/* -------------------------------main application----------------------------------------------- */}
        <div className='keyboards' ref={this.appRef}>

          {/* the card that constructs conditional buttons */}
          <Keyboard
            leftSection='Search text keyword' classProp={keyboardVisibilityToggle}
            icon='' typeContent=''
            id={'f1'} cardSelected={'0'}
          >
            <ButtonWithHandler name='INCLUDES' />
            <ButtonWithHandler name='STARTS WITH' />
            <ButtonWithHandler name='ENDS WITH' />
            <input // the keyword used to search
                type='text' onChange={this.textHandler}
                placeholder='Type keyword' ref={this.textInput}
                className='keyboardTextInput'
              />
              <div className={inputVisibility}><div>in position</div></div>
              <input // by default, any match would satisfy condition, regardless of position
                type='text' className={`positionInput ${inputVisibility}`}
                onChange={this.positionHandler}
              />
            <ButtonWithHandler name='SUBMIT' typeSubmit='text' />
            <ButtonWithHandler name='CANCEL' />
          </Keyboard>
          <Keyboard
            leftSection='Search number' classProp={keyboardVisibilityToggle}
            icon='' typeContent=''
            id={'f2'} cardSelected={'0'}
          >
            <ButtonWithHandler name='>' />
            <ButtonWithHandler name='<' />
            <ButtonWithHandler name='>=' />
            <ButtonWithHandler name='=<' />
            <ButtonWithHandler name='=' />
            <input // number of reference
              type='number' className='numberInputVisibility'
              onChange={this.numberHandler} placeholder='Type number'
            />
            <ButtonWithHandler name='SUBMIT' typeSubmit='number' />
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
                <SelectButton card={el.cardId} fromSelect={this.selectCard}>Select</SelectButton>
                <input type='text' placeholder='Input column numbers' onChange={this.columnSelector}></input>
                <button type='button' onClick={this.columnSelectorSubmit}>Submit</button>
              </div>
            );
            return (
              <Keyboard
                id={el.cardId} leftSection={typeContent}
                classProp={keyboardVisibilityToggle} rightSection={iconsElements}
                cardSelected={cardSelected} key={el.cardId}
              >
                <ConditionButtonFormatter fromFormatter={this.fromFormat}>
                  {el.listElements.map((elem, indx) => {
                    return (listCards[index].listOperations[indx] &&
                    listCards[index].listOperations[indx].active) ? elem : null
                  })}
                </ConditionButtonFormatter>
              </Keyboard>
            );
          })}
          <div className="dataDisplayButtons dataDisplayButtonsTabbed">
            <div className="dataDisplayLeftTabbedButtons">
              <button onClick={this.executeFilter}>

                  Filter
              </button>
              <button onClick={this.clear}>
                Clear
              </button>
            </div>
            <div>
              <button onClick={this.viewFilters}>
                View filters
              </button>
            </div>
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

        <Table data={data} fromSortButton={this.fromSortButton}
          listCards={listCards} sorter={this.sorter}
          filtering={filtering} conditionalButtonChanges={conditionalButtonChanges}
          fileID={fileID} username={username}
        />
      </div>
    );
  }
}

// DataDisplay.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default DataDisplay;
