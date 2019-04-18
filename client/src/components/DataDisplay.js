import React, {Component} from 'react';
import { matchPath } from 'react-router-dom';
import axios from 'axios';
import uuid from 'uuid';

import Table from './Table';
import Keyboard from './Keyboard';
import ButtonGroup from './ButtonGroup';
import ComponentEnhancer from './ComponentEnhancer';
import ConditionButtonFormatter from './ConditionButtonFormatter';
import DumbButton from './DumbButton';
// import MenuOption from './MenuOption';
// import DropDownMenu from './DropDownMenu';
import Icon from './Icon';
import SelectButton from './SelectButton';
import ColumnSelector from './ColumnSelector';

// import PropTypes from 'prop-types';
import '../App.css';

class DataDisplay extends Component {
  constructor (props) {
    super(props);
    const match = matchPath(this.props.location.pathname,{
      path: '/api/datadisplay/:id'
    });
    this.state = {
      prevPath: '',
      data: {
        header: [],
        body: [],
        id: ''
      },
      fileID: match.params.id,
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
    }
  }

  componentDidMount() {
    console.log('in DataDisplay props.match: ', this.props);
    const { fileID } = this.state;
    console.log('datadisplay rendered');
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    axios.get(`/api/datadisplay/${fileID}`, conf)
      .then(async (response) => {
        console.log('get data start');
        console.log('data is: ', response);
        let newHeader = [];
        let newBody = [];
        response.data.header.map(el => newHeader.push([uuid.v4(), el]));
        response.data.body.map(el => {
          let newRow = [];
          el.map(elem => newRow.push([uuid.v4(), elem]));
          return newBody.push([uuid.v4(), newRow]);
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

  render() {
    console.log('data from DataDisplay is: ', this.props.state);
    const {data, inputVisibility, active, listCards, cardSelected
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
          {/* <DropDownMenu
            menuVisible={menuVisible} mouseOutMenu={this.menuHide}
            style={{ top: menuTop, left: menuLeft }}
          >
            <MenuElementWithHandler name='NOT' />
            <MenuElementWithHandler name='AND' />
            <MenuElementWithHandler name='OR' />
            <MenuElementWithHandler name='DELETE' />
          </DropDownMenu> */}
        </div>

        <h3>{data.description}</h3>
        <Table data={data}/>
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
