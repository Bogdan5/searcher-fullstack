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
    console.log('column no: ', direction, columnNo);
    console.log('data is: ', this.state.data);
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
    // console.log('list Operations: ', listCards[0].listOperations);
    if (listCards[0].listOperations.length > 0 && filtering){
      console.log('filtering is done');
      for (let i of listCards){
        let filteredColumns = [...i.field];
        if (i.field.length === 0) {
          filteredColumns = Array.from(new Array(data.header.length), (x, i) => i);
        }
        for (let j = i.listOperations.length - 1; j>= 0; j--) {
          if (i.listOperations[j].active) {
            for (let k of filteredColumns){
              // console.log('arr is', arr);
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
      <table className='dataTable'>
        <thead>
          <tr>
            {header.map((el, index) => (
              <th key={el[0]} className='headerSortButtons'>
                <SortButton key={el[0]} name={el[1]}
                sorter={this.sorter} columnNo={index} />
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


      // <div className='Table'>
      //   <div>
      //     {header.map((el, index) => (
      //       <div key={el[0]} className='headerSortButtons'>
      //         <SortButton key={el[0]} name={el[1]}
      //         sorter={this.sorter} columnNo={index} />
      //       </div>
      //     ))}
      //   </div>
      //   <div className='tableData'>
      //     {body.map(el => {
      //       if (this.filterExecuted(el[1])){
      //         return (
      //           <div key={el[0]} className='rowTable'>
      //             {el[1].map(elem => (
      //               <div key={elem[0]} className='cellTable'>{elem[1]}</div>
      //             ))}
      //           </div>
      //         );
      //       }
      //       return null;
      //     })}
      //   </div>
      // </div>
    );
  }
}

export default Table;
