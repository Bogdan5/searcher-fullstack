import React, {Component} from 'react';
import '../App.scss';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortButton from './SortButton';
import axios from 'axios';

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
      containsActive1: false,
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.data.description !== prevProps.data.description && this.props.data.description){
      // console.log('update: ', this.props.data);
      this.setState({ data: this.props.data });
    }
    if(prevProps.conditionalButtonChanges !== this.props.conditionalButtonChanges){
      this.setState({ containsActive1: this.containsActive(this.props.listCards)})
    }
  }

  sorter = (direction, columnNo) => {
    console.log('data ', this.props.data);
    console.log('column no: ', direction, columnNo);
    console.log('data is: ', this.state.data);
    let sortedArray = this.state.data.body.sort((a,b) => {
      console.log(a[1][columnNo]);
      let x, y;
      if (direction === 'up'){
        x = a[1][columnNo][1];
        y = b[1][columnNo][1];
      } else if (direction === 'down'){
        x = b[1][columnNo][1];
        y = a[1][columnNo][1];
      }
      if (y < x) { return 1 }
      else if (x === y) { return 0 }
      else { return -1 }
    });
    let newData = Object.assign({}, this.state.data, { body: sortedArray });
    this.setState({ data: newData });
  }

  typeSelector = (value, columnNo) => {
    const { body } = this.state.data;
    const newData = Array.from(body, row => Array.from(row, (x, i) => {
      if (i === columnNo) {
        return Array.from(x, (y, index) => {
          if (index === 1) {
            switch (value) {
              case 'str':
                return y + '';
              case 'num':
                return parseInt(y);
              case 'bool':
                return (y === 'true');
              default:
            }
          }
          return y;
        })
      }
      return x;
    }));
    this.setState({ data: newData });

  }

  filterExecuted = (arr) => {
    const { listCards, filtering } = this.props;
    const { data, containsActive1 } = this.state;
    if (filtering && containsActive1){
      for (let i of listCards){
        let filteredColumns = [...i.field];
        if (i.field.length === 0) {
          filteredColumns = Array.from(new Array(data.header.length), (x, i) => i);
          operations:
          for (let j = i.listOperations.length - 1; j>= 0; j--) {
            if (i.listOperations[j].active) {
              for (let k of filteredColumns){
                if (i.listOperations[j].func(arr[k][1])) {
                  console.log('condition fulfilled ', arr[k][1]);
                  break operations;
                }
              }
              console.log('condition not fulfilled ');
              return false;
            }
          }
        } else {
          for (let j = i.listOperations.length - 1; j>= 0; j--) {
            if (i.listOperations[j].active) {
              for (let k of filteredColumns){
                if (!i.listOperations[j].func(arr[k][1])) { 
                  return false;
                }
              }
              break;
            }
          }
        }
        
      }
      // return false;
    } 
    return true;
  }

  containsActive = (cards) => cards.reduce((accum, elem) => 
    elem.listOperations.reduce((acc, el) => el.active || acc, false) || accum, false);

  saveChanges = (e) => {
    const { fileID } = this.props;
    const { data } = this.state;
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer },
      data,
    };
    axios.update(`/api/datadisplay/${fileID}`, conf)
      .then((response) => {})
      .catch((err) => {});
  }

  render(){
    const {header, body, description } = this.state.data;
    return (
      <div>
        <div>
          <span>{description}</span>
          <button
            type="button"
            className="tableSaveButton"
            onClick={this.saveChanges}
          >Save changes</button>
        </div>
        <h3 className='displayTitle'>{description}</h3>
        <table className='dataTable'>
          <thead>
            <tr>
              {header.map((el, index) => (
                <th key={el[0]} className='headerSortButtons'>
                  <SortButton key={el[0]} name={el[1]}
                  sorter={this.sorter} columnNo={index}
                  type={this.typeSelector}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map(el => {
              // if (el[1].length) {console.log(this.filterExecuted(el[1]));}
              if (el[1].length && this.filterExecuted(el[1])){
                return (
                  <tr key={el[0]} className='rowTable'>
                    {el[1].map(elem => (
                      <td key={elem[0]} className='cellTable'>{elem[1]}</td>
                    ))}
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>

    );
  }
}

export default Table;
