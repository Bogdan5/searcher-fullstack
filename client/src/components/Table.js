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
    const {listCards} = this.props;
    // console.log('listCards in table: ', listCards[0].listOperations.length);
    if (listCards[0].listOperations.length > 0){
      for (let i of listCards){
        for (let j = i.listOperations.length - 1; j>= 0; j--) {
          for (let k of arr){
            for (let l of i.filterExecuted){
              if (i.listOperations[j].func(k[1][l])) { return true }
            }
          }
        }
      }
      return false;
    } else {
      // console.log('smaller than 0');
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
