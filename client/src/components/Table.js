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
      console.log('update: ', this.props.data);
      this.setState({ data: this.props.data });
    }
  }
  // console.log('header: ', props.data2.header);
  // console.log('body: ', props.data2.body);

  // const handler =  (direction, buttonNumber) => { 
  //   props.fromSortButton(direction, buttonNumber);
  // }

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
          {body.map(el => (
            <div key={el[0]} className='rowTable'>
              {el[1].map(elem => (
                <div key={elem[0]} className='cellTable'>{elem[1]}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
  
      // <table>
      //   <thead>
      //     <tr>
      //       {header.map((el) => (<th key={el[0]}>{el[1]}</th>))}
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {body.map(el => (
      //       <tr key={el[0]}>
      //         {el[1].map(elem => (
      //           <td key={elem[0]}>{elem[1]}</td>
      //         ))}
      //       </tr>
      //     ))}
      //   </tbody>
      // </table>
    );
  }
}

export default Table;
