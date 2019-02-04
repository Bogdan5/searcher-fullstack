import React, { Component } from 'react';
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

import './App.css';
import SortButton from './components/SortButton';

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
      data: [{
        column1: 12,
        column2: 23,
        column3: 20,
      }],
    };
  }

  componentDidMount() {
    this.textInput.current.focus();
  }

  textHandler = (e) => {
    this.setState({ keyword: e.target.value });
  };

  positionHandler = (e) => {
    this.setState({ position: e.target.value });
  }