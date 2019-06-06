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
        listOperations: [], // what conditions aply to the data - helps sort
        listElements: []
      }],
      cardSelected: 0, // where conditional buttons go at one time
      currentCardIndex: 0,
      keyword: '', // content of the keyword input text field
      inputVisibility: 'visible', // in the second Keyboard, whether the position input is visible
      keywordButtonClicked: '', // name of button clicked in the keyword(2nd) Keyboard
      active: [], // array of buttons active
      position: 0,
      idConditional: 0,
      menuVisible: false,
      mergerArray: [null, null, null],
      filtering: false,
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
      const matcher = data.match(reg);
      if (matcher && (position || position === 0)) {
        return data.match(reg).index === position;
      }
      return false;
    }
  }

  endsWith (whatIsIncluded){
    const reg = new RegExp(this.regExpEscape(whatIsIncluded) + '$');
    return function(data){
      return reg.test(data);
    }
  }

  conjunction(fn1, fn2){
    return function(data){
      return fn1(data) && fn2(data);
    }
  }
  
  disjunction(fn1, fn2){
    return function(data){
      return fn1(data) || fn2(data);
    }
  }
  
  negation(fn){
    return function(data){
      return !fn(data);
    }
  }

  fromButton = async (name) => {
    const {
      keyword, keywordButtonClicked, cardSelected,
      position, listCards, currentCardIndex
    } = this.state;
    
    let chldList = [];
    let lst = [];
    switch (name) {
      case 'SUBMIT':
        const copyListCards = [...listCards];
        // const currentCardIndex = this.cardSearcher(cardSelected);
        const copyListOperations = [...copyListCards[currentCardIndex].listOperations];
        const copyListElements = [...copyListCards[currentCardIndex].listElements];

        let idCond = uuid.v4();

        if (keywordButtonClicked && keyword) {
          let conditionObj = {
            id: idCond,
            active: true,
            card: cardSelected,
            whatIsIncluded: keyword
          };
          switch (keywordButtonClicked) {
            case 'INCLUDES':
              lst = ['Includes ', keyword, ' at position ', position];
              conditionObj.position = position || 0;
              conditionObj.func = this.include(conditionObj.whatIsIncluded, conditionObj.position);
              break;
            case 'ENDS WITH':
              lst = ['Ends with ', keyword];
              conditionObj.func = this.endsWith(conditionObj.whatIsIncluded);
              break;
            case 'STARTS WITH':
              lst = ['Starts with ', keyword];
              conditionObj.func = this.include(conditionObj.whatIsIncluded, 0);
              break;
            default:
          }
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

          this.setState({ listCards: copyListCards, filtering: false });
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

  selectCard = (card) => {
    this.setState({ cardSelected: card, currentCardIndex: this.cardSearcher(card) });
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

  buttonSearcher = (id) => {
    const { listCards, cardSelected } = this.state;
    const cardIndex = this.cardSearcher(cardSelected);
    for (let i = 0; i < listCards[cardIndex].listOperations.length; i++) {
      if (listCards[cardIndex].listOperations[i].id === id) { return i; }
    }
    return -1;
  };

  cardSearcher = (cardId) => {
    const { listCards } = this.state;
    console.log('cardSearcher');
    for (let i in listCards) {
      if (listCards[i].cardId === cardId) { return i; }
    }
    return -1;
  }

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
    let newOperation = { id: newId, active: true };
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
    await this.setState({listCards: copyListCards});

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
          cardId: listCards.length,
          listOperations: [],
          listElements: [],
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
    this.setState({ filtering: true });
  }

  clear = () => {
    this.setState({ listCards: [{
      cardId: 0,
      field: [],
      listOperations: [],
      listElements: [],
      idConditional: 0,
      menuVisible: false,
      mergerArray: [null, null, null],
      filtering: false,
      currentCardIndex: 0,
    }]});
  }

  render() {
    const {data, inputVisibility, active, listCards, cardSelected, menuVisible,
      menuTop, menuLeft, filtering,
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

    // const currentCardIndex = this.cardSearcher(cardSelected);

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
                <SelectButton card={el.cardId} fromSelect={this.selectCard}>Select</SelectButton>
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
                  {el.listElements.map((elem, indx) => {
                    return (listCards[index].listOperations[indx] &&
                    listCards[index].listOperations[indx].active) ? elem : null
                  })}
                </ConditionButtonFormatter>
              </Keyboard>
            );
          })}
          <div>
            <button onClick={this.executeFilter}>Filter</button>
            <button onClick={this.clear} >Clear</button>
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
            listCards={listCards} sorter={this.sorter}
            filtering={filtering}/>
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
