import React, {Component} from 'react';
import '../App.scss';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortButton from './SortButton';

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.data.description !== prevProps.data.description && this.props.data.description){
      // console.log('update: ', this.props.data);
      this.setState({ data: this.props.data });
    }
  }

  sorter = (direction, columnNo) => {
    let sortedArray = this.state.data.body.sort((a,b) => {
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

  filterExecuted = (arr) => {
    const { listCards, filtering } = this.props;
    const { data } = this.state;
    if (listCards[0].listOperations.length > 0 && filtering){
      for (let i of listCards){
        let filteredColumns = [...i.field];
        if (i.field.length === 0) {
          filteredColumns = Array.from(new Array(data.header.length), (x, i) => i);
        }
        for (let j = i.listOperations.length - 1; j>= 0; j--) {
          if (i.listOperations[j].active) {
            for (let k of filteredColumns){
              if (i.listOperations[j].func(arr[k][1])) { 
                return true;
               }
            }
            break;
          }
        }
      }
      return false;
    } else {
      return true;
    }
  }

  render(){
    const {header, body} = this.state.data;
    return (
      <div >
        <div>
          {header.map((el, index) => (
            <div key={el[0]} className='headerSortButtons'>
              <SortButton key={el[0]} name={el[1]}
              sorter={this.sorter} columnNo={index} />
            </div>
          ))}
        </div>
        <div className='tableData'>
          {body.map(el => {
            if (this.filterExecuted(el[1])){
              return (
                <div key={el[0]} className='rowTable'>
                  {el[1].map(elem => (
                    <div key={elem[0]} className='cellTable'>{elem[1]}</div>
                  ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
}

export default Table;
